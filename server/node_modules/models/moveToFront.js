const router = require("express").Router();
const { User, validate } = require("./user");

router.put("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        const { imageUrl } = req.body;
        const imageIndex = user.image.findIndex((image) => image === imageUrl);
        if (imageIndex === -1) {
            return res.status(404).json({ message: "Изображение не найдено" });
        }
        const [movedImage] = user.image.splice(imageIndex, 1);
        user.image.unshift(movedImage);
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;
