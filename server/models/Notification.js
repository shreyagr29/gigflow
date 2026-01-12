const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['hired', 'rejected', 'info'],
    default: 'info',
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedGigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
