import { StatusCodes } from 'http-status-codes';
import Listing from '../models/listing.model.js';
import constants from '../utils/constants.js';
import { errorHandler } from '../utils/error.js';

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getAllListings = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

/**
 *
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
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getListing = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const updateListing = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteListing = async (req, res, next) => {
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
