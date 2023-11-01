import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import constants from '../utils/constants.js';
import { errorHandler } from '../utils/error.js';
import { generateUserResponse } from './user.controller.js';

/**
 * Sign up method
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const signup = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();

    res.status(StatusCodes.CREATED).json({
      status: constants.success,
      message: constants.userSignUp,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Sign in method
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(StatusCodes.NOT_FOUND, 'User not found'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(StatusCodes.UNAUTHORIZED, 'Wrong credentials'));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const response = generateUserResponse(validUser, constants.userSignIn);

    res
      .cookie(constants.accessToken, token, { httpOnly: constants.true })
      .status(StatusCodes.OK)
      .json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Google Sign in/Sign up method
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const google = async (req, res, next) => {
  const { email, photo } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      const randomNumber = Math.random().toString(36).slice(-8);
      const generatedPassword = randomNumber + randomNumber;
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username: email.split('@')[0],
        email,
        password: hashedPassword,
        avatar: photo,
      });

      user = await newUser.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const response = generateUserResponse(user, constants.userSignIn);

    res
      .cookie(constants.accessToken, token, { httpOnly: constants.true })
      .status(StatusCodes.OK)
      .json(response);
  } catch (error) {
    next(error);
  }
};
