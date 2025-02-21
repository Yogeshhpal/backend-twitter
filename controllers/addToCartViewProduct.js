const addToCartModel = require("../models/cartProduct");

const addToCartViewProduct = async (req, res) => {
    try {
        const currentUser = req.userId;

        if (!currentUser) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
                error: true
            });
        }

        const allProduct = await addToCartModel.find({
            userId: currentUser
        }).populate('productId'); // Populating product details if productId is a reference

        return res.status(200).json({
            data: allProduct,
            success: true,
            error: false
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = addToCartViewProduct;
