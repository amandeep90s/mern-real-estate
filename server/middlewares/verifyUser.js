import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const verifyToken = (req, _res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(StatusCodes.UNAUTHORIZED, 'Unauthorized User'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return next(errorHandler(StatusCodes.FORBIDDEN, 'Forbidden'));
    }

    req.user = user;
    next();
  });
};
