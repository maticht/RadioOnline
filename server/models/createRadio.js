const router = require("express").Router();
const { Radio: CreateRadio } = require("./radio");

router.post("/", async (req, res) => {
    try {
            let radio = await CreateRadio.findOne({ title: req.body.title });
            if (radio) return res
                .status(409)
                .send({ message: "Радиостанция с данным названием уже существует!" });
        radio = await new CreateRadio({ ...req.body }).save();
        return res.status(201).send({ message: "Радиостанция добавлена успешно" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Внутренняя ошибка сервера" });
    }
});

module.exports = router;
