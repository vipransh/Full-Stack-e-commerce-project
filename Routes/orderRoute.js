import express from 'express';
const orderRouter=express.Router();
import { isLoggedIn } from '../middlewares/auth.middleware.js';

import { generateRazorpayOrderId, getOrderHistory, getRazorpayKey, paymentVerification } from '../Controllers/order.controller.js';

orderRouter.route("/payments").post(isLoggedIn, generateRazorpayOrderId);
orderRouter.route("/getRazorpayKey").get(isLoggedIn, getRazorpayKey);
orderRouter.route("/paymentVerification").post(isLoggedIn, paymentVerification);
orderRouter.route("/getOrderHistory").get(isLoggedIn, getOrderHistory);

export default orderRouter;