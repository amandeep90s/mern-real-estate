import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
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

    const { _id: userId, username, email, avatar } = updatedUser;

    res.status(StatusCodes.OK).json({
      status: constants.success,
      message: constants.userUpdated,
      id: userId,
      email,
      username,
      avatar,
    });
  } catch (error) {
    next(error);
  }
};
