const {Genre} = require("../models/genre");

class GenreController {
    async create(req, res, next) {
        try {
            let country = await Genre.findOne({name: req.body.name});
            if (country) return res.status(409).send({message: "Жанр уже существует!"});
            await new Genre({name: req.body.name}).save();
            return res.status(201).send({message: "Жанр добавлен успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async delete(req, res){
        try {
            const {id} = req.body
            const deleted = await Genre.findByIdAndRemove(id);
            return res.json(`DELETED SUCCESS ${deleted}`);
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getAll(req, res){
        try {
            let genre = await Genre.find();
            if (!genre) return res.status(409).send({message: "Жанров нет в базе данных!"});
            genre.sort((a,b) => {
                return a.name.localeCompare(b.name);
            });
            return res.json(genre);
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }
}


module.exports = new GenreController()