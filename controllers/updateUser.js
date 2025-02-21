const userModel = require("../models/userModel");

async function updateUser(req, res) {
    try {
        const sessionUser = req.userId;
        const { userId, email, name, role } = req.body;

        const payload = {
            ...(email && { email }),
            ...(name && { name }),
            ...(role && { role })
        };

        const user = await userModel.findById(sessionUser);

        // console.log("user.role : ", user.role);

        const updatedUser = await userModel.findByIdAndUpdate(userId, payload, { new: true }); // Use { new: true } to return the updated document

        res.status(200).json({
            data: updatedUser,
            message: "User Updated",
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err, // Corrected the typo from messgae to message
            error: true,
            success: false
        });
    }
}

module.exports = updateUser;
