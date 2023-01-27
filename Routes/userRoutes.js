// const express=require('express');
import express from 'express';
const userRouter=express.Router();

import {forgotPassword, getProfile, login, logout, resetPassword, signUp} from"../Controllers/auth.controller.js"


// signup route
userRouter.route('/signUp').post(signUp);

// login route
userRouter.route('/login').get(login);

// logout route
userRouter.route('/logout').get(logout);

// forgot password route
userRouter.route('/forgotPassword').get(forgotPassword);

// Reset Password route
userRouter.route('/resetPassword').get(resetPassword);

// Get Profile route
userRouter.route('/getProfile').get(getProfile);





export default userRouter;




