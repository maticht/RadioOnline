const router = require("express").Router();
const { User } = require("./user");

router.put("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        if (!user.rating) {
            user.rating = [];
        }
        const { userId, value, description, firstName, lastName, commentatorId} = req.body;
        const existingRatingIndex = user.rating.findIndex(rating => rating?.commentatorId?.toString() === commentatorId);
        if (existingRatingIndex !== -1) {
            user.rating[existingRatingIndex].value = value;
            user.rating[existingRatingIndex].description = description;
            user.rating[existingRatingIndex].firstName = firstName;
            user.rating[existingRatingIndex].lastName = lastName;
            user.rating[existingRatingIndex].commentatorId = commentatorId;
        } else {
            user.rating.push({ user: userId, value, description, firstName, lastName, commentatorId });
        }
        const updatedUser = await user.save();
        return res.status(200).json({ data: updatedUser });
    } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;

