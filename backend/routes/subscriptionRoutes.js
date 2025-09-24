import express from 'express';
const router = express.Router();
import { addSubscription } from '../controllers/subscriptionController.js';

router.route('/').post(addSubscription);

export default router;