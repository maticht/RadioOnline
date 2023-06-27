const router = require("express").Router();
const { User, validate } = require("./user");
const bcrypt = require('bcryptjs');
const Joi = require("joi");
const Token = require("./token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

router.get("/:id/verify/:token/", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            token: req.params.token,
        });

        await User.updateOne({ _id: req.params.id }, { verified: true });


        if (!res.headersSent) {
            res.status(200).send({ message: "Email verified successfully" });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});


module.exports = router;
