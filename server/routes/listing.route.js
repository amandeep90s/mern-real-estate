import express from 'express';
import {
  createListing,
  deleteListing,
  getAllListings,
  getListing,
  updateListing,
} from '../controllers/listing.controller.js';
import { verifyToken } from '../middlewares/verifyUser.js';

const router = express.Router();

router.get('/', verifyToken, getAllListings);
router.post('/', verifyToken, createListing);
router.get('/:id', getListing);
router.put('/:id', verifyToken, updateListing);
router.delete('/:id', verifyToken, deleteListing);

export default router;
