const addToCartModel = require("../models/cartProduct")

const countAddToCartProduct = async (req, res) => {
    try {
        const userId = req.userId

        const count = await addToCartModel.countDocuments({
            userId: userId
        })

        res.json({
            data: count,
            message: "OK",
            error: false,
            success: true
        })
    }
    catch (err) {
        res.json({
            message: error?.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = countAddToCartProduct