import Comment from '../models/Comment.js';
import Item from '../models/Item.js';
import AppError from '../utils/AppError.js';

export const createComment = async (itemId, authorId, content) => {
  const item = await Item.findById(itemId);
  if (!item) {
    throw new AppError('Item listing not found', 404);
  }

  if (item.status === 'rejected') {
    throw new AppError('Cannot comment on a rejected listing', 400);
  }

  const comment = await Comment.create({
    item: itemId,
    author: authorId,
    content
  });

  return comment.populate('author', 'name email avatar');
};

export const getCommentsForItem = async (itemId) => {
  const item = await Item.findById(itemId);
  if (!item) {
    throw new AppError('Item listing not found', 404);
  }

  const comments = await Comment.find({ item: itemId })
    .sort('createdAt')
    .populate('author', 'name email avatar');

  return comments;
};

export const deleteComment = async (commentId, userId, role) => {
  const comment = await Comment.findById(commentId).populate('item');
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  // Deletion check: author of comment, reporter of item, or admin
  const isAuthor = comment.author.toString() === userId.toString();
  const isItemReporter = comment.item.reporter.toString() === userId.toString();
  const isAdmin = role === 'admin';

  if (!isAuthor && !isItemReporter && !isAdmin) {
    throw new AppError('You are not authorized to delete this comment', 403);
  }

  await Comment.findByIdAndDelete(commentId);
};
