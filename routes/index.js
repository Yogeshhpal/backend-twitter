const express = require('express');
const userSignUpController = require('../controllers/userSignUp');
const userSignInController = require('../controllers/userSignIn');
const userDetailsController = require('../controllers/userDetails');
const authToken = require('../middleware/authToken');
const userLogout = require('../controllers/userLogout');
const allUsers = require('../controllers/allUsers');
const updateUser = require('../controllers/updateUser');
const UploadProductController = require('../controllers/uploadProduct');
const getProductController = require('../controllers/getProduct');
const updateProductController = require('../controllers/updateProduct');
const getCategoryProductOne = require('../controllers/getCategoryProductOne');
const getCategoryWiseProduct = require('../controllers/getCategoryWiseProduct');
const getProductDetails = require('../controllers/getProductDetails');
const addToCartController = require('../controllers/addToCartController');
const countAddToCartProduct = require('../controllers/countAddToCartProduct');
const addToCartViewProduct = require('../controllers/addToCartViewProduct');
const updateAddToCartProduct = require('../controllers/updateAddToCartProduct');
const deleteAddToCartProduct = require('../controllers/deleteAddToCartProduct');
const searchProduct = require('../controllers/searchProduct');
const filterProductController = require('../controllers/filterProduct');
// ***************************************
const Razorpay = require('razorpay');
const crypto = require('crypto');
const orderModel = require('../models/orderSchema');
const orderController = require('../controllers/orderController');
require('dotenv').config();
// **************************************


const router = express.Router();

// Define  signup route
router.post('/signup', userSignUpController);
//Define signIn route
router.post('/signin', userSignInController);
//Get user data
router.get('/user-details', authToken, userDetailsController);
//Logged Out
router.get('/userLogout', userLogout)

//Admin Panel
router.get("/all-user", allUsers)
//update user details on panel
router.post('/update-user', updateUser)

//Upload Products
router.post("/upload-product", authToken, UploadProductController)
//Get products
router.get("/get-product", getProductController)
//Edit Product
router.post("/update-product", updateProductController);
//Get particular category product
router.get("/get-categoryProduct", getCategoryProductOne)
router.post('/category-product', getCategoryWiseProduct)
//product detail
router.post("/product-details", getProductDetails)
//search product on searchBar
router.get("/search", searchProduct)
//Filter
router.post("/filter-product", filterProductController)




//User add to cart
router.post("/addtocart", authToken, addToCartController)
router.get("/countAddToCartProduct", authToken, countAddToCartProduct)
router.get("/view-cart-product", authToken, addToCartViewProduct)
//update product quantity
router.post("/update-cart-product", authToken, updateAddToCartProduct)
//product removed from cart
router.post("/delete-cart-product", authToken, deleteAddToCartProduct)


//payment and order
router.post("/order", async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: "rzp_test_xHq484RLEGtuvY",
            key_secret: "GEzGusVPSHXx4fyo5ZXnFTcn"
        });

        const { amount, currency, receipt, firstName, lastName, email, addressLine1, addressLine2, city, state, postalCode, country, quantity, userId, productDetails } = req.body;
        const options = {
            amount,
            currency,
            receipt,
        };
        const order = await razorpay.orders.create(options)
        if (!order) {
            return res.status(500).send("Error")
        }
        const newOrder = new orderModel({
            amount: amount / 100,
            currency,
            receipt,
            firstName,
            lastName,
            email,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            quantity,
            orderId: order.id,
            userId: userId,
            productDetails
        });
        const orderDetails = await newOrder.save();
        res.json({
            order: order,
            orderDetails: orderDetails,
            message: "order created and stored successfully",
            error: false,
            success: true
        })

    } catch (err) {
        res.status(500).send("Error");
    }
})

router.post("/order/validate", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sha = crypto.createHmac("sha256", "GEzGusVPSHXx4fyo5ZXnFTcn");
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
        return res.status(400).json({ msg: "Transection is not legit!" });
    }

    res.json({
        message: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,

    })
})
router.get("/order-list", authToken, orderController)



module.exports = router;
