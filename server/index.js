import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.log(error));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000`);
});
