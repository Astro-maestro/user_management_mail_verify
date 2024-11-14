const User = require("../modules/user/model/User");

exports.checkEmail = async (req, res, next) => {
    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const { name, email, password } = req.body;

        // Check if all fields are present
        if (!(name && email && password )) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // If all checks pass, move to the next middleware/controller
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
