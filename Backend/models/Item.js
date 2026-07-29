import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an item title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an item description'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: [true, 'Please specify listing type (lost or found)']
  },
  category: {
    type: String,
    required: [true, 'Please provide an item category'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please specify date lost or found']
  },
  location: {
    type: String,
    required: [true, 'Please specify the location'],
    trim: true,
  },
  images: [
    {
      type: String,
    }
  ],
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Every item listing must belong to a reporter']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'claimed', 'returned', 'rejected'],
    default: 'pending'
  },
  identifyingQuestions: [
    {
      type: String,
    }
  ]
}, {
  timestamps: true
});

// Compound text index for title & description searches
itemSchema.index({ title: 'text', description: 'text' });

const Item = mongoose.model('Item', itemSchema);
export default Item;
