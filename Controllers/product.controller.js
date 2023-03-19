import Product from "../models/product.schema.js"
import formidable from 'formidable';
import fs from "fs"
import {deleteFile, s3FileUpload} from "../services/imageUpload.js"
import Mongoose from "mongoose"
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../utils/customError.js'
import config from "../config/index.js"
import AuthRoles from "../utils/authRoles.js";

/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/


export const addProduct = asyncHandler(async (req, res) => {
    // check if user is authorized to access this route
    if(req.user.role==AuthRoles.USER)
    {
        throw new CustomError("You are not authorized to access this route",400)
    }


    const form = formidable({
        multiples: true,
        keepExtensions: true
    });

    form.parse(req, async function (err, fields, files){
        try {
            if (err) {
                throw new CustomError(err.message || "Something went wrong", 500)
            }
            let productId = new Mongoose.Types.ObjectId().toHexString();
            // console.log(fields, files)

            // check for fields
            if (!fields.name || 
                !fields.price ||
                !fields.description ||
                !fields.collectionId
                ) {
                    throw new CustomError("Please fill all details", 500)
            }

            // handling images
            let imgArrayResp = Promise.all(
                Object.keys(files).map(async (filekey, index) => {
                    const element = files[filekey]

                    const data = fs.readFileSync(element.filepath)

                    const upload = await s3FileUpload({
                        bucketName: config.S3_BUCKET_NAME,
                        key: `products/${productId}/photo_${index + 1}.png`,
                        body: data,
                        contentType: element.mimetype
                    })
                    return {
                        secure_url: upload.Location
                    }
                })
            )

            let imgArray = await imgArrayResp;

            const product = await Product.create({
                _id: productId,
                photos: imgArray,
                ...fields,
            })

            if (!product) {
                throw new CustomError("Product was not created", 400)
                //remove image
            }
            res.status(200).json({
                success: true,
                product
            })
           
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Something went wrong"
            })
        }
    })
})

/**********************************************************
 * @GET_ALL_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for getting all products details
 * @description User and admin can get all the products
 * @returns Products Object
 *********************************************************/

export const getAllProducts = asyncHandler( async (req, res) => {
    const products = await Product.find({})

    if (!products) {
        throw new CustomError("No product was found", 404)
    }
    res.status(200).json({
        success: true,
        products
    })
})


/**********************************************************
 * @GET_PRODUCT_BY_ID
 * @route https://localhost:5000/api/product
 * @description Controller used for getting single product details
 * @description User and admin can get single product details
 * @returns Product Object
 *********************************************************/


export const getProductById = asyncHandler( async (req, res) => {
    const {id: productId} = req.params

    const product = await Product.findById(productId)

    if (!product) {
        throw new CustomError("No product was found", 404)
    }
    res.status(200).json({
        success: true,
        product
    })
})


/**********************************************************
 * @GET_PRODUCT_BY_CATEGORY
 * @route https://localhost:5000/api/product
 * @description Controller used for getting products by category
 * @returns Product Object
 *********************************************************/

export const getProductsByCategory=asyncHandler(async(req,res)=>{
    const {catId}=req.params

    if(!(catId))
    {
        throw new CustomError("category id is required",400);
    }

    const products=await Product.find({collectionId: catId});


    if(!(products))
    {
        throw new CustomError("Category not found",400);
    }

    res.status(201).json({
        success: true,
        products
    })
})

// assignment to read

/*
model.aggregate([{}, {}, {}])

$group
$push
$$ROOT
$lookup
$project

*/