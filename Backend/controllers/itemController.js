import * as itemService from '../services/itemService.js';

export const createItem = async (req, res, next) => {
  try {
    const newItem = await itemService.createItem(req.body, req.files, req.user._id);

    res.status(201).json({
      success: true,
      message: 'Item listing created successfully',
      data: {
        item: newItem
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const { items, pagination } = await itemService.queryItems(req.query);

    res.status(200).json({
      success: true,
      message: 'Items retrieved successfully',
      data: {
        items,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const item = await itemService.getItemById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item retrieved successfully',
      data: {
        item
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const updatedItem = await itemService.updateItem(
      req.params.id,
      req.body,
      req.user._id.toString(),
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Item listing updated successfully',
      data: {
        item: updatedItem
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    await itemService.deleteItem(
      req.params.id,
      req.user._id.toString(),
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Item listing deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
