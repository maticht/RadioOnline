const router = require("express").Router();
const { Radio } = require("./radio");

router.put("/:id", async (req, res) => {
    try {
        const radio = await Radio.findById(req.params.id);
        if (!radio) {
            return res.status(404).send({ message: "Radio not found" });
        }
        if (!radio.rating) {
            radio.rating = [];
        }
        const { userId, value, description, name, commentatorId} = req.body;
        const existingRatingIndex = radio.rating.findIndex(rating => rating?.commentatorId?.toString() === commentatorId);
        // if (existingRatingIndex !== -1) {
        //     user.rating[existingRatingIndex].value = value;
        //     user.rating[existingRatingIndex].description = description;
        //     user.rating[existingRatingIndex].name = name;
        //     user.rating[existingRatingIndex].commentatorId = commentatorId;
        // } else {
        //     user.rating.push({ user: userId, value, description, name, commentatorId });
        // }

        radio.rating.push({ user: userId, value, description, name, commentatorId });
        const updatedUser = await radio.save();
        return res.status(200).json({ data: updatedUser });
    } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;

