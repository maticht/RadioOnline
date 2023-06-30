const uuid = require('uuid') // генерирует рандомные неповторяющиеся айди
const path = require('path')
const {Radio} = require("../models/radio");
const {Types} = require("mongoose");
const {Genre} = require("../models/genre");
const {Country} = require("../models/country");
const {Language} = require("../models/language");

class RadioController {
    async create(req, res, next) {
        try {
            let radio = await Radio.findOne({title: req.body.title});
            if (radio) return res.status(409).send({message: "Радиостанция с данным названием уже существует!"});
            const {image} = req.files
            let fileName = uuid.v4() + ".jpg"
            await image.mv(path.resolve(__dirname, '..', 'static', fileName))
            await new Radio({
                title: req.body.title,
                radio: req.body.radio,
                language: req.body.language_id,
                genre: req.body.genre_id,
                country: req.body.country_id,
                image: fileName,
            }).save();
            return res.status(201).send({message: "Радиостанция добавлена успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getAll(req, res) {
        let {country_id, genre_id, page, limit, searchName} = req.query
        let offset = page * limit - limit
        console.log(req.query)
        let radioStations
        let resultCount
        if (searchName === '') {
            if (!country_id && !genre_id) {
                radioStations = await Radio.find().skip(offset).limit(limit);
                resultCount = await Radio.countDocuments();
            } else if (country_id && !genre_id) {
                radioStations = await Radio.find({country: Types.ObjectId(country_id)}).skip(offset).limit(limit);
                resultCount = await Radio.countDocuments({country: Types.ObjectId(country_id)});
            } else if (!country_id && genre_id) {
                radioStations = await Radio.find({genre: Types.ObjectId(genre_id)}).skip(offset).limit(limit);
                resultCount = await Radio.countDocuments({genre: Types.ObjectId(genre_id)});
            } else if (country_id && genre_id) {
                radioStations = await Radio.find({
                    country: Types.ObjectId(country_id),
                    genre: Types.ObjectId(genre_id)
                }).skip(offset).limit(limit);
                resultCount = await Radio.countDocuments({
                    country: Types.ObjectId(country_id),
                    genre: Types.ObjectId(genre_id)
                });
            }
        } else {
            if (!country_id && !genre_id) {
                let query = {title: {$regex: searchName, $options: 'i'}};
                radioStations = await Radio.find(query).skip(offset).limit(limit);
                resultCount = await Radio.countDocuments(query);
            } else if (country_id && !genre_id) {
                let query = {
                    title: {$regex: searchName, $options: 'i'},
                    country: Types.ObjectId(country_id)
                };
                radioStations = await Radio.find(query).skip(offset).limit(limit);
                resultCount = await Radio.countDocuments(query);
            } else if (!country_id && genre_id) {
                let query = {
                    title: {$regex: searchName, $options: 'i'},
                    genre: Types.ObjectId(genre_id)
                };
                radioStations = await Radio.find(query).skip(offset).limit(limit);
                resultCount = await Radio.countDocuments(query);
            } else if (country_id && genre_id) {
                let query = {
                    title: {$regex: searchName, $options: 'i'},
                    country: Types.ObjectId(country_id),
                    genre: Types.ObjectId(genre_id)
                };
                radioStations = await Radio.find(query).skip(offset).limit(limit);
                resultCount = await Radio.countDocuments(query);
            }
        }
        console.log(radioStations, resultCount)
        const count = resultCount
        return res.json([radioStations, count])
    }

    async getOne(req, res) {
        const id = req.params.id;
        try {
            let radioStation = await Radio.findById(id)
            const genre = Genre.findById(radioStation.genre).name
            const country = Country.findById(radioStation.country).name
            const language = Language.findById(radioStation.language).name
            return res.json([radioStation, genre, country, language])
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }
}

module.exports = new RadioController()