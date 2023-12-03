import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import constants from '../utils/constants.js';
import { errorHandler } from '../utils/error.js';

/**
 * Update user information
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const updateUser = async (req, res, next) => {
  const { id } = req.params;

  if (id !== req.user.id) {
    return next(
      errorHandler(
        StatusCodes.UNAUTHORIZED,
        'You can only update your own account!'
      )
    );
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const response = generateUserResponse(updatedUser, constants.userUpdated);

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Generate response for user object
 * @param {*} user
 * @param {*} message
 * @returns
 */
export const generateUserResponse = (user, message) => {
  const { _id: id, username, email, avatar } = user;

  return {
    status: constants.success,
    message,
    id,
    email,
    username,
    avatar,
  };
};

/**
 * Delete user from app
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  if (id !== req.user.id) {
    return next(
      errorHandler(
        StatusCodes.UNAUTHORIZED,
        'You can only update your own account!'
      )
    );
  }

  try {
    await User.findByIdAndDelete(id);

    res.clearCookie('access_token');
    res.status(StatusCodes.OK).json({
      status: constants.true,
      message: constants.userDeleted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user listings
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getUserListings = async (req, res, next) => {
  // Check if user is trying to view his own listings. If not, throw error.
  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(
        StatusCodes.UNAUTHORIZED,
        'You can only view your own listings'
      )
    );
  }

  try {
    const listings = await Listing.find({ userRef: req.params.id });

    res.status(StatusCodes.OK).json(listings);
  } catch (error) {
    next(error);
  }
};
