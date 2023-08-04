const {CustomError} = require("../models/customError");

class CustomErrorController {
    async create(req, res, next) {
        try {
            await new CustomError({
                text: req.body.text,
                radioStationName: req.body.radioStationName,
                radioStationLink: req.body.radioStationLink,
            }).save();
            return res.status(201).send({message: "Ошибка добавлена успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.body
            const deleted = await CustomError.findByIdAndRemove(id);
            return res.json(`DELETED SUCCESS ${deleted}`);
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getAll(req, res) {
        try {
            let customError = await CustomError.find();
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

module.exports = new CustomErrorController()