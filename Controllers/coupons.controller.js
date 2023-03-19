import Coupon from '../models/coupon.schema.js'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../utils/customError.js'
import AuthRoles from '../utils/authRoles.js'

/**********************************************************
 * @CREATE_COUPON
 * @route https://localhost:5000/api/coupon
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create the coupon
 * @returns Coupon Object with success message "Coupon Created SuccessFully"
 *********************************************************/

export const createCoupon=asyncHandler(async (req, res)=>{
    // check if user is authorized to access this route
    if(req.user.role==AuthRoles.USER)
    {
        throw new CustomError("You are not authorized to access this route",400);
    }

    const {code, discount}=req.body;

    console.log("coupon ", code, discount);

    // check if code and discount feilds
    if(!(code && discount))
    {
        throw new CustomError("Coupon code and discount details are required", 400);
    }

    // create coupon in datbase
    const coupon= await Coupon.create({
        code,
        discount
    })

    // send response to frontend
    res.status(200).json({
        success: true,
        message: "Coupon created successfully"
    })


})


/**********************************************************
 * @DEACTIVATE_COUPON
 * @route https://localhost:5000/api/coupon/deactive/:couponId
 * @description Controller used for deactivating the coupon
 * @description Only admin and Moderator can update the coupon
 * @returns Coupon Object with success message "Coupon Deactivated SuccessFully"
 *********************************************************/

export const deactivateCoupon=asyncHandler(async (req,res)=>{
     // check if user is authorized to access this route
     if(req.user.role==AuthRoles.USER)
     {
         throw new CustomError("You are not authorized to access this route",400);
     }

     const {couponId}=req.params;

    //  check if coupon id is present or not
    if(!(couponId))
    {
        throw new CustomError("Coupon Id is required",400);
    }

    const coupon=await Coupon.findByIdAndUpdate({_id: couponId}, {active: false});

   res.status(200).json({
    success: true,
    message: "coupon deactivated"
   })

    
})


/**********************************************************
 * @DELETE_COUPON
 * @route https://localhost:5000/api/coupon/:couponId
 * @description Controller used for deleting the coupon
 * @description Only admin and Moderator can delete the coupon
 * @returns Success Message "Coupon Deleted SuccessFully"
 *********************************************************/

export const deleteCoupon=asyncHandler(async (req,res)=>{
    // check if user is authorized to access this route
    if(req.user.role==AuthRoles.USER){
        throw new CustomError("You are not authorized to access this route", 400);
    }

    const {couponId}=req.params;
    if(!couponId){
        throw new CustomError("Coupon code is required", 400);
    }

    const coupon=await Coupon.findByIdAndDelete({_id: couponId});

    if(!coupon){
        throw new CustomError("No Coupon found",400)
    }

    res.status(200).json({
        success: true,
        message: "Coupon deleted successfully"
    })
})



/**********************************************************
 * @GET_ALL_COUPONS
 * @route https://localhost:5000/api/coupon
 * @description Controller used for getting all coupons details
 * @description Only admin and Moderator can get all the coupons
 * @returns allCoupons Object
 *********************************************************/

export const getAllCoupon=asyncHandler(async (req,res)=>{
     // check if user is authorized to access this route
     if(req.user.role==AuthRoles.USER){
        throw new CustomError("You are not authorized to access this route", 400);
    }

    const coupons=await Coupon.find({});

    if(!coupons){
        throw new CustomError("No Coupons were found");
    }

    res.status(200).json({
        success: true,
        message: "coupons found successfully",
        coupons
    })
})

/**********************************************************
 * @VALIDATE_COUPON
 * @route https://localhost:5000/api/coupon
 * @description Controller used for validating a coupon
 * @description user can check if the coupon is valid or not
 * @returns if valid returns coupon
 *********************************************************/

export const validateCoupon=asyncHandler(async (req,res)=>{
    // get coupon name from frontend
    const {code}=req.params
    // console.log(code);
    if(!code)
    {
        throw new CustomError("Coupon name is required",401);
    }

    const coupon=await Coupon.findOne({code});

    if(!coupon)
    {
        throw new CustomError("Invalid Coupon Code!",401);
        
    }

    if(!coupon.active)
    {
        throw new CustomError("Coupon Experied!",401);
    }

    res.status(201).json({
        success: true,
        message: "Coupon applied successfully",
        coupon
    })
})

