import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.log(error));

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000`);
});
