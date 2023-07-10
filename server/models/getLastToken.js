const router = require("express").Router();
const Token = require("./token");

router.get("/", async (req, res) => {
    const tokens = await Token.find();
    const lastToken = tokens[tokens.length - 1];
    res.json(lastToken);
});

module.exports = router;
