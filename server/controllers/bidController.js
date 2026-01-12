const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const Notification = require('../models/Notification');

// @desc    Place a bid on a gig
// @route   POST /api/bids
// @access  Private
const placeBid = async (req, res) => {
  const { gigId, message, amount } = req.body;

  // Validate gig exists
  const gig = await Gig.findById(gigId);
  if (!gig) {
    return res.status(404).json({ message: 'Gig not found' });
  }

  if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Owner cannot bid on their own gig' });
  }

  if (gig.status !== 'open') {
      return res.status(400).json({ message: 'Gig is not open for bidding' });
  }

  // Check if user already bid
  const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id });
  if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid' });
  }

  const bid = await Bid.create({
    gigId,
    freelancerId: req.user._id,
    message,
    amount,
  });

  res.status(201).json(bid);
};

// @desc    Get bids for a specific gig
// @route   GET /api/bids/:gigId
// @access  Private (Owner only)
const getBidsByGigId = async (req, res) => {
    const gig = await Gig.findById(req.params.gigId);
    
    if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
    }

    // Only owner can see bids
    if (gig.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view bids for this gig' });
    }

    const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email');
    res.json(bids);
};

// @desc    Hire a freelancer (Atomic Transaction)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Owner only)
const hireFreelancer = async (req, res) => {
    const { bidId } = req.params;
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const bid = await Bid.findById(bidId).session(session);
        if (!bid) {
            res.status(404);
            throw new Error('Bid not found');
        }

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig) {
            res.status(404);
            throw new Error('Gig not found');
        }

        // Verify ownership
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to hire for this gig');
        }

        // Check if gig is already assigned (Race condition prevention)
        if (gig.status !== 'open') {
            res.status(400);
            throw new Error('Gig is already assigned');
        }

        // 1. Update Gig status
        gig.status = 'assigned';
        await gig.save({ session });

        // 2. Update Chosen Bid status
        bid.status = 'hired';
        await bid.save({ session });

        // 3. Reject all other bids for this gig
        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bidId } },
            { status: 'rejected' },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        // 4. Notifications (Socket + DB Persistance)
        const io = req.app.get('io');
        
        // Save Hired Notification
        const hiredMsg = `Congratulations! You have been hired for ${gig.title}!`;
        await Notification.create({
            userId: bid.freelancerId,
            type: 'hired',
            message: hiredMsg,
            relatedGigId: gig._id
        });
        
        if (io) {
            io.to(`user_${bid.freelancerId}`).emit('notification', {
                type: 'hired',
                message: hiredMsg,
                gigId: gig._id,
            });
        }

        // Handle Rejected Notifications
        const rejectedBids = await Bid.find({ gigId: gig._id, _id: { $ne: bidId } });
        // Bulk create for efficiency? Or loop. Loop is fine for small scale.
        const rejectedNotifications = rejectedBids.map(rb => ({
            userId: rb.freelancerId,
            type: 'rejected',
            message: `Thank you for your interest. Another freelancer has been selected for ${gig.title}.`,
            relatedGigId: gig._id
        }));

        if (rejectedNotifications.length > 0) {
            await Notification.insertMany(rejectedNotifications);
        }

        if (io) {
            rejectedBids.forEach(rejectedBid => {
                io.to(`user_${rejectedBid.freelancerId}`).emit('notification', {
                    type: 'rejected',
                    message: `Thank you for your interest. Another freelancer has been selected for ${gig.title}.`,
                    gigId: gig._id,
                });
            });
        }

        res.json({ message: 'Freelancer hired successfully', bid });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        const status = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(status).json({ message: error.message });
    }
};

module.exports = {
    placeBid,
    getBidsByGigId,
    hireFreelancer
};
