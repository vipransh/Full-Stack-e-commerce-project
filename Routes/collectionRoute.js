import express from 'express';
const collectionRouter=express.Router();
import {isLoggedIn} from '../middlewares/auth.middleware.js'

import {createCollection, deleteCollection, getAllCollections, updateCollection} from '../Controllers/collection.controller.js';

// create collection route
collectionRouter.route("/createCollection").post(isLoggedIn, createCollection);

// update collection route
collectionRouter.route("/updateCollection/:id").put(isLoggedIn, updateCollection);

// delete collection route
collectionRouter.route("/deleteCollection/:id").delete(isLoggedIn, deleteCollection);

// get all collection route
collectionRouter.route("/getAllCollections").get(isLoggedIn, getAllCollections);


export default collectionRouter;