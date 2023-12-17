import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import Listing from '../models/listing.model.js';
import constants from '../utils/constants.js';
import { errorHandler } from '../utils/error.js';

/**
 * Get all listings
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getAllListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res
      .status(StatusCodes.OK)
      .json({ status: constants.true, listings });
  } catch (error) {
    next(error);
  }
};

/**
 * Create listing
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);

    res.status(StatusCodes.CREATED).json({
      status: constants.success,
      message: constants.createListing,
      listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get listing with id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getListing = async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return next(errorHandler(StatusCodes.BAD_REQUEST, 'Invalid Id!'));
  }

  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(StatusCodes.NOT_FOUND, 'Listing not found'));
    }

    res.status(StatusCodes.OK).json({
      status: constants.success,
      message: constants.getListing,
      listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update listing
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const updateListing = async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return next(errorHandler(StatusCodes.BAD_REQUEST, 'Invalid Id!'));
  }

  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(StatusCodes.NOT_FOUND, 'Listing not found'));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(
        errorHandler(
          StatusCodes.UNAUTHORIZED,
          'You can only update your own listings!'
        )
      );
    }

    const updateListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      status: constants.success,
      message: constants.updateListing,
      listing: updateListing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete listing
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteListing = async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return next(errorHandler(StatusCodes.BAD_REQUEST, 'Invalid Id!'));
  }

  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(StatusCodes.NOT_FOUND, 'Listing not found'));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(
        errorHandler(
          StatusCodes.UNAUTHORIZED,
          'Unauthorized! You can only delete your own listings!'
        )
      );
    }

    await Listing.findByIdAndDelete(req.params.id);

    res
      .status(StatusCodes.OK)
      .json({ status: constants.true, message: constants.deleteListing });
  } catch (error) {
    next(error);
  }
};
