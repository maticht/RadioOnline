const {Language} = require("../models/language");

class LanguageController {
    async create(req, res, next) {
        try {
            let language = await Language.findOne({name: req.body.name});
            if (language) return res.json({status: 409, message: "Язык уже существует!"});
            await new Language({name: req.body.name}).save();
            return res.status(201).send({message: "Язык добавлен успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async delete(req, res){
        try {
            const {id} = req.body
            const deleted = await Language.findByIdAndRemove(id);
            return res.json(`DELETED SUCCESS ${deleted}`);
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getAll(req, res){
        try {
            let language = await Language.find();
            if (!language) return res.status(409).send({message: "Языков нет в базе данных!"});
            language.sort((a,b) => {
                return a.name.localeCompare(b.name);
            });
            return res.json(language);
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }
}

module.exports = new LanguageController()