import express from 'express';
const mainRouter=express.Router();

import userRouter from './userRoutes.js';
import collectionRouter from './collectionRoute.js';
import couponRouter from './couponRoute.js';
import productRouter from './productRoute.js';



mainRouter.use('/user', userRouter);
mainRouter.use("/collection", collectionRouter);
mainRouter.use("/coupon", couponRouter);
mainRouter.use("/product", productRouter);


export default mainRouter;
