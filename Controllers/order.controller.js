import Product from "../models/product.schema.js";
import Coupon from "../models/coupon.schema.js";
import Order from "../models/order.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import razorpay from "../config/razorpay.config.js";
import config from "../config/index.js";
import crypto from 'crypto';

/**********************************************************
 * @GENEARATE_RAZORPAY_ID
 * @route https://localhost:5000/api/order/razorpay
 * @description Controller used for genrating razorpay Id
 * @description Creates a Razorpay Id which is used for placing order
 * @returns Order Object with "Razorpay order id generated successfully"
 *********************************************************/

export const generateRazorpayOrderId = asyncHandler( async (req, res)=>{
    //get product and coupon from frontend
    const {product, coupon}=req.body

    //verfiy product price from backend
    let totalAmount=0;
    let discount=0;
    product.map(async(prod)=>{
        const res=await Product.findById(prod._id);
        totalAmount+=res.price*prod.quantity
    })

    //validate coupon and get discount amount
    const validateCoupon=await Coupon.findOne({code: coupon});
    if(validateCoupon && validateCoupon.active)
    {
        discount=Math.round((validateCoupon.discount*totalAmount)/100);
    }
    

    // set final amount
    let finalAmount=totalAmount-discount;
  

    const options = {
        amount: Math.round(finalAmount*100),
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`
    }

    const order = await razorpay.orders.create(options)

    //if order does not exist
    if(!(order.status==="created"))
    {
        throw new CustomError("Failed to create order",401);
    }


      // success then, send it to front end
      res.status(201).json({
        success: true,
        order
    })
    

})

/**********************************************************
 * @GET_RAZORPAY_KEY
 * @route https://localhost:5000/api/order/getRazerpayKey
 * @description Controller used for sending razerorpay key
 * @returns razorpay key
 *********************************************************/

export const getRazorpayKey=asyncHandler(async(req,res)=>{
    // send key to frontend
    const key=config.RAZORPAY_KEY_ID;
    res.status(201).json({
        success: true,
        key
    })
})


/******************************************************
 * @PAYMENT_VERIFICATION
 * @route http://localhost:5000/api/v/order/paymentVerification
 * @description verify razorpay signature and create order in database
 * @parameters orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature, product, address,   phoneNumber, coupon, finalAmount
 * @returns success message "Payment completed successfully"
 ******************************************************/

export const paymentVerification=asyncHandler(async(req,res)=>{
    try {
        const {orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature, product, address, phoneNumber, coupon, finalAmount}=req.body;

        console.log("verification route");

        const shasum = crypto.createHmac('sha256', config.RAZORPAY_SECRET);
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
        const digest = shasum.digest('hex');
    

        const isAuthentic = digest === razorpaySignature;
        // console.log("isAuthentic",isAuthentic);

      if(isAuthentic)
      {
        const productArray = await Promise.all(product.map(async (prod) => {
            const res = await Product.findById(prod._id);
            res.stock=res.stock-prod.quantity;
            await res.save();
            return { productId: res._id, productImage: res.photos[0].secure_url, productName: res.name ,count: prod.quantity, price: res.price };
          }));


        const order=await Order.create({
            products: productArray,
            user: req.user._id,
            address: address,
            phoneNumber: phoneNumber,
            amount: finalAmount,
            coupon: coupon,
            transactionId: orderCreationId,
        })
        // console.log(order);
        // send success response to frontend
        res.status(201).json({
            success: true,
            message: "Payment completed Successfully"
        })
      }
      else
      {
        res.status(400).json({
            success: false,
            message: "payment failed"
        })
      }
    } catch (error) {
        throw new CustomError(error,400)
    }
})

/******************************************************
 * @GET_ORDER_HISTORY
 * @route http://localhost:5000/api/v/order/paymentVerification
 * @description verify razorpay signature and create order in database
 * @parameters 
 * @returns success message "Payment completed successfully"
 ******************************************************/

export const getOrderHistory=asyncHandler(async(req,res)=>{

    const userId=req.user._id;
    // console.log(userId);

    const orders=await Order.find({user: userId}).populate("products", "name photo");

    if(!orders)
    {
        throw new CustomError("Order history not found",400);
    }

    res.status(201).json({
        success: true,
        orders
    })
})
