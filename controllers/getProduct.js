const productModel = require("../models/productModel")

const getProductController = async (req, res) => {
    try {
        // const allProduct = await productModel.find().sort({ createdAt: -1 }) //.sort will sort the products

        const validCategories = ["Male", "Female", "Others"];

        const allProduct = await productModel.find({ category: { $in: validCategories } }).sort({ createdAt: -1 });

        res.json({
            message: "All Products",
            success: true,
            error: false,
            data: allProduct
        })

    }
    catch (err) {
        res.status(400).json({
            messgae: err.message || err,
            error: true,
            sucess: false
        })
    }
}

module.exports = getProductController