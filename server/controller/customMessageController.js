const {customMessage} = require("../models/customMessage");

class CustomMessageController {
    async create(req, res, next) {
        console.log(req.body)
        try {
            await new customMessage({
                message: req.body.description,
                name: req.body.name,
                email: req.body.email,
            }).save();
            return res.status(201).send({message: "Сообщение отправлено успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.body
            const deleted = await customMessage.findByIdAndRemove(id);
            return res.json(`DELETED SUCCESS ${deleted}`);
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getAll(req, res) {
        try {
            let messages = await customMessage.find();
            console.log(messages)
            if (!messages) return res.status(409).send({message: "Сообщений нет в базе данных!"});
            messages.sort((a, b) => {
                return b.created- a.created;
            });
            return res.json(messages);
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }
}

module.exports = new CustomMessageController()