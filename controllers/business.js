const Business = require('../models/Business');
const User = require('../models/User');

exports.registerBusiness = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        const { user, name, desc, address, insta, fb, tiktok } = req.body;

        if (!user || !name || !desc || !address) {
            return res.status(400).json({
                message: "Required fields: user, name, description, address."
            });
        }

        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const newBusiness = new Business({
            user,
            name,
            desc,
            address,
            insta,
            fb,
            tiktok
        });

        await newBusiness.save();

        userExists.business = newBusiness._id;
        await userExists.save();

        const populatedBusiness = await Business.findById(newBusiness._id)
            .populate('user', 'fullName email');

        res.status(201).json({
            message: "Business registered successfully",
            business: populatedBusiness
        });

    } catch (error) {
        console.error("Error registering business:", error.message);
        res.status(500).json({ message: error.message });
    }
};
