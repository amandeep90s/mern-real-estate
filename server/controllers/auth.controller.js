import bcryptjs from 'bcryptjs';
import status from 'http-status';
import User from '../models/user.model.js';

export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();

    res
      .status(status.CREATED)
      .json({ status: 'success', message: 'User created successfully' });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};
