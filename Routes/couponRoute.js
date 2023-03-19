import express from 'express'
import {isLoggedIn} from '../middlewares/auth.middleware.js'
const couponRouter=express.Router();

import {createCoupon, deactivateCoupon, deleteCoupon, getAllCoupon, validateCoupon} from '../Controllers/coupons.controller.js'


// create coupon route
couponRouter.route("/createCoupon").post(isLoggedIn, createCoupon);

// deactivate coupon route
couponRouter.route("/deactivateCoupon/:couponId").put(isLoggedIn, deactivateCoupon);

// delete coupon route
couponRouter.route("/deleteCoupon/:couponId").delete(isLoggedIn, deleteCoupon);

// get all coupon route
couponRouter.route("/getAllCoupon").get(isLoggedIn, getAllCoupon);

// validate coupon
couponRouter.route("/validateCoupon/:code").get(validateCoupon);


export default couponRouter;

