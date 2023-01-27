import express from 'express';
const mainRouter=express.Router();

import userRouter from './userRoutes.js';
import collectionRouter from './collectionRoute.js';



mainRouter.use('/user', userRouter);
mainRouter.use("/collection", collectionRouter);


export default mainRouter;
