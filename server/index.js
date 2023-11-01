import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import userRouter from './routes/user.route.js';
import constants from './utils/constants.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(constants.connectedToDb))
  .catch((error) => console.log(error));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || constants.internalServerError;

  return res.status(statusCode).json({
    status: constants.false,
    statusCode,
    message,
  });
});

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000`);
});
