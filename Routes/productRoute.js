import express from 'express';
const productRouter=express.Router();
import { isLoggedIn } from '../middlewares/auth.middleware.js';

import {addProduct, getAllProducts, getProductById, getProductsByCategory} from '../Controllers/product.controller.js'

// add product to database
productRouter.route("/addProduct").post(isLoggedIn, addProduct);

// get all products route
productRouter.route("/getAllProducts").get(getAllProducts);

// get product by Id route
productRouter.route("/getProductById/:id").get(getProductById);

//get products by category
productRouter.route("/getProductsByCategory/:catId").get(getProductsByCategory);

export default productRouter;