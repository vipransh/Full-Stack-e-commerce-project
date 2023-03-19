import express from 'express';
const mainRouter=express.Router();

import userRouter from './userRoutes.js';
import collectionRouter from './collectionRoute.js';
import couponRouter from './couponRoute.js';
import productRouter from './productRoute.js';
import orderRouter from './orderRoute.js';



mainRouter.use('/auth', userRouter);
mainRouter.use("/collection", collectionRouter);
mainRouter.use("/coupon", couponRouter);
mainRouter.use("/product", productRouter);
mainRouter.use("/order", orderRouter);


export default mainRouter;
