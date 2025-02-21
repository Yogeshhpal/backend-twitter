const addToCartModel = require("../models/cartProduct");

const updateAddToCartProduct = async (req, res) => {
    try {
        const currentUserId = req.userId; // Assuming userId is populated in middleware or request
        const addToCartProductId = req.body._id; // Assuming _id of product to update is passed in request body
        const qty = req.body.quantity; // Assuming quantity to update is passed in request body

        // Ensure addToCartModel.updateOne is correctly used based on your model setup
        const updateProduct = await addToCartModel.updateOne(
            { _id: addToCartProductId }, // Filter: Update the document with this _id
            { ...(qty && { quantity: qty }) } // Update: Conditionally update quantity if qty exists
        );

        res.json({
            message: "Product Quantity Updated",
            data: updateProduct,
            error: false,
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = updateAddToCartProduct;
