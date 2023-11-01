import { StatusCodes } from 'http-status-codes';
import Listing from '../models/listing.model.js';
import constants from '../utils/constants.js';

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
  } catch (error) {
    next(error);
  }
};
