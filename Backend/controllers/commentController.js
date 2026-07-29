import * as commentService from '../services/commentService.js';

export const createComment = async (req, res, next) => {
  try {
    const { item, content } = req.body;
    const newComment = await commentService.createComment(item, req.user._id, content);

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      data: {
        comment: newComment
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsForItem = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsForItem(req.params.itemId);

    res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: {
        comments
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(
      req.params.id,
      req.user._id.toString(),
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
