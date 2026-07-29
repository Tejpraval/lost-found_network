import Claim from '../models/Claim.js';
import Item from '../models/Item.js';
import AppError from '../utils/AppError.js';
import * as notificationService from './notificationService.js';

export const createClaim = async (itemId, claimerId, answers, message) => {
  const item = await Item.findById(itemId);
  if (!item) {
    throw new AppError('Item not found', 404);
  }

  // 1) Verify item is still open/active
  if (item.status === 'returned' || item.status === 'rejected') {
    throw new AppError('This item is no longer available for claiming', 400);
  }

  // 2) Finder cannot claim their own found items
  if (item.reporter.toString() === claimerId.toString()) {
    throw new AppError('You cannot claim an item you reported', 400);
  }

  // 3) Validate answers array matches identifying questions length
  if (item.identifyingQuestions && answers.length !== item.identifyingQuestions.length) {
    throw new AppError(`You must provide exactly ${item.identifyingQuestions.length} answers`, 400);
  }

  // 4) Check for duplicate claims
  const existingClaim = await Claim.findOne({ item: itemId, claimer: claimerId });
  if (existingClaim) {
    throw new AppError('You have already submitted a claim for this item', 400);
  }

  // 5) Create the claim
  const claim = await Claim.create({
    item: itemId,
    claimer: claimerId,
    answers,
    message
  });

  // Notify the item reporter (finder)
  await notificationService.createNotification(
    item.reporter,
    claimerId,
    'claim_created',
    itemId,
    claim._id
  );

  return claim;
};

export const getClaimsForItem = async (itemId, userId, role) => {
  const item = await Item.findById(itemId);
  if (!item) {
    throw new AppError('Item not found', 404);
  }

  // Only the original reporter or admin can review claims
  if (item.reporter.toString() !== userId.toString() && role !== 'admin') {
    throw new AppError('You are not authorized to view claims for this item', 403);
  }

  const claims = await Claim.find({ item: itemId }).populate('claimer', 'name email avatar');
  return claims;
};

export const getMyClaims = async (userId) => {
  const claims = await Claim.find({ claimer: userId }).populate('item', 'title status location type date');
  return claims;
};

export const processClaim = async (claimId, status, userId, role) => {
  if (!['approved', 'rejected'].includes(status)) {
    throw new AppError('Invalid status update. Must be approved or rejected', 400);
  }

  const claim = await Claim.findById(claimId).populate('item');
  if (!claim) {
    throw new AppError('Claim not found', 404);
  }

  // Verify only item reporter or admin can process
  if (claim.item.reporter.toString() !== userId.toString() && role !== 'admin') {
    throw new AppError('You are not authorized to process this claim', 403);
  }

  if (claim.status !== 'pending') {
    throw new AppError('This claim has already been processed', 400);
  }

  if (status === 'approved') {
    // 1) Update parent claim
    claim.status = 'approved';
    await claim.save();

    // 2) Close the listing
    await Item.findByIdAndUpdate(claim.item._id, { status: 'returned' });

    // 3) Notify the approved claimer
    await notificationService.createNotification(
      claim.claimer,
      userId,
      'claim_approved',
      claim.item._id,
      claim._id
    );

    // 4) Find other pending claims to reject and notify
    const pendingClaims = await Claim.find({
      item: claim.item._id,
      _id: { $ne: claim._id },
      status: 'pending'
    });

    for (const otherClaim of pendingClaims) {
      otherClaim.status = 'rejected';
      await otherClaim.save();

      await notificationService.createNotification(
        otherClaim.claimer,
        userId,
        'claim_rejected',
        claim.item._id,
        otherClaim._id
      );
    }
  } else {
    claim.status = 'rejected';
    await claim.save();

    // Notify the rejected claimer
    await notificationService.createNotification(
      claim.claimer,
      userId,
      'claim_rejected',
      claim.item._id,
      claim._id
    );
  }

  return claim;
};
