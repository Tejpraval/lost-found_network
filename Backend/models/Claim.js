import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'A claim must be associated with an item']
  },
  claimer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A claim must have a claimer']
  },
  answers: [
    {
      type: String,
      required: [true, 'Answers to identifying questions are required']
    }
  ],
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Prevent duplicate claims from the same user on the same item
claimSchema.index({ item: 1, claimer: 1 }, { unique: true });

const Claim = mongoose.model('Claim', claimSchema);
export default Claim;
