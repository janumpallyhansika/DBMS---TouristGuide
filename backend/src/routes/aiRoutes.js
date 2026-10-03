import express from 'express';

import {
  chatWithAI,
  planTripWithAI
} from '../controllers/aiController.js';

import authMiddleware
  from '../middleware/authMiddleware.js';

const router =
  express.Router();

router.post(
  '/chat',
  authMiddleware,
  chatWithAI
);

router.post(
  '/plan-trip',
  authMiddleware,
  planTripWithAI
);

export default router;