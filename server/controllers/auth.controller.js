import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.model.js';

export const signup = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();

    res
      .status(StatusCodes.CREATED)
      .json({ status: 'success', message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};
