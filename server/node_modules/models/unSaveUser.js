const router = require("express").Router();
const { User, validate } = require("./user");
router.put("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        if (!Array.isArray(user.savedUsers) || !user.savedUsers.includes(req.body.userId)) {
            return res.status(409).send({ message: "User is not saved" });
        }
        let index = user.savedUsers.indexOf(req.body.userId);
        while (index !== -1) {
            user.savedUsers.splice(index, 1);
            index = user.savedUsers.indexOf(req.body.userId);
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
