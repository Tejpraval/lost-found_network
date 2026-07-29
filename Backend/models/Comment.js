import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'A comment must belong to an item']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A comment must have an author']
  },
  content: {
    type: String,
    required: [true, 'Comment content cannot be empty'],
    trim: true,
    maxlength: [1000, 'Comment content cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
