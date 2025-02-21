const orderModel = require("../models/orderSchema");

const orderController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        if (!currentUserId) {
            return res.status(400).json({
                message: "User ID is required",
                error: true
            });
        }

        const orderList = await orderModel.find({ userId: currentUserId }).sort({ createdAt: -1 });

        if (orderList.length === 0) {
            return res.json({
                data: [],
                message: "No orders found for this user",
                success: true
            });
        }

        res.json({
            data: orderList,
            message: "Order list",
            success: true
        });

    } catch (error) {
        console.error("Error fetching order list:", error);
        res.status(500).json({
            message: error.message || error,
            error: true
        });
    }
};

module.exports = orderController;
