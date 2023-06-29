const {Country} = require("../models/country");

class CountryController {
    async create(req, res, next) {
        try {
            let country = await Country.findOne({name: req.body.name});
            if (country) return res.status(409).send({message: "Страна уже существует!"});
            await new Country({name: req.body.name}).save();
            return res.status(201).send({message: "Страна добавлена успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async delete(req, res){
        try {
            const deleted = await Country.findByIdAndRemove(req.params.id);
            return res.json(`DELETED SUCCESS ${deleted}`);
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getAll(req, res){
        try {
            let country = await Country.find();
            if (!country) return res.status(409).send({message: "Стран нет в базе данных!"});
            return res.json(country);
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }
}

module.exports = new CountryController()