import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification must have a recipient'],
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification must have a sender']
  },
  type: {
    type: String,
    enum: ['claim_created', 'claim_approved', 'claim_rejected', 'comment_created'],
    required: [true, 'Notification type is required']
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Notification must be linked to an item']
  },
  claim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim'
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
