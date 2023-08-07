const {customRating} = require("../models/customRating");

class CustomRatingController {
    async create(req, res, next) {
        try {
            await new customRating({
                value: req.body.value,
                description: req.body.description,
                name: req.body.name,
                email: req.body.email,
                commentatorId: req.body.commentatorId,
            }).save();
            return res.status(201).send({message: "Отзыв добавлен успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.body
            const deleted = await customRating.findByIdAndRemove(id);
            return res.json(`DELETED SUCCESS ${deleted}`);
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getAll(req, res) {
        try {
            let customError = await customRating.find();
            if (!customError) return res.status(409).send({message: "Ошибок нет в базе данных!"});
            customError.sort((a, b) => {
                return b.time- a.time;
            });
            return res.json(customError);
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }
}

module.exports = new CustomRatingController()
