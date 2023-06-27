const router = require("express").Router();
const { User, validate } = require("./user");
const Joi = require("joi");

router.get("/", async (req, res) => {
    try {
        const favoriteUserIds = req.query.ids ? req.query.ids.split(',') : [];
        console.log("Received favorite user IDs:", favoriteUserIds);
        const users = await User.find({ _id: { $in: favoriteUserIds } });
        res.status(200).json(users);
    } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
