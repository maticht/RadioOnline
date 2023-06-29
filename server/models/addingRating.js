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

        radio.rating.push({ user: userId, value, description, name, commentatorId });
        const updatedUser = await Radio.save();
        return res.status(200).json({ data: updatedUser });
    } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;