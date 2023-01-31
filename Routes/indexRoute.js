import express from 'express';
const mainRouter=express.Router();

import userRouter from './userRoutes.js';
import collectionRouter from './collectionRoute.js';
import couponRouter from './couponRoute.js';



mainRouter.use('/user', userRouter);
mainRouter.use("/collection", collectionRouter);
mainRouter.use("/coupon", couponRouter);


export default mainRouter;
