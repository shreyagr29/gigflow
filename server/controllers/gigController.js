const Gig = require('../models/Gig');

// @desc    Get all gigs
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const status = req.query.status ? { status: req.query.status } : {};

  const gigs = await Gig.find({ ...keyword, ...status }).populate('ownerId', 'name email');
  res.json(gigs);
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
const getGigById = async (req, res) => {
  const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

  if (gig) {
    res.json(gig);
  } else {
    res.status(404).json({ message: 'Gig not found' });
  }
};

// @desc    Create a gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
  const { title, description, budget } = req.body;

  const gig = new Gig({
    ownerId: req.user._id,
    title,
    description,
    budget,
  });

  const createdGig = await gig.save();
  res.status(201).json(createdGig);
};

// @desc    Get gigs by current user (for dashboard)
// @route   GET /api/gigs/mygigs
// @access  Private
const getMyGigs = async (req, res) => {
    const gigs = await Gig.find({ ownerId: req.user._id });
    res.json(gigs);
};

module.exports = {
  getGigs,
  getGigById,
  createGig,
  getMyGigs
};
