import * as claimService from '../services/claimService.js';

export const createClaim = async (req, res, next) => {
  try {
    const { item, answers, message } = req.body;
    const newClaim = await claimService.createClaim(item, req.user._id, answers, message);

    res.status(201).json({
      success: true,
      message: 'Claim request submitted successfully',
      data: {
        claim: newClaim
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getClaimsForItem = async (req, res, next) => {
  try {
    const claims = await claimService.getClaimsForItem(
      req.params.itemId,
      req.user._id.toString(),
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Claims retrieved successfully',
      data: {
        claims
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyClaims = async (req, res, next) => {
  try {
    const claims = await claimService.getMyClaims(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Your claims retrieved successfully',
      data: {
        claims
      }
    });
  } catch (error) {
    next(error);
  }
};

export const processClaim = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updatedClaim = await claimService.processClaim(
      req.params.id,
      status,
      req.user._id.toString(),
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: `Claim request ${status} successfully`,
      data: {
        claim: updatedClaim
      }
    });
  } catch (error) {
    next(error);
  }
};
