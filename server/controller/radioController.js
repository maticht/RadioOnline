const uuid = require('uuid') // генерирует рандомные неповторяющиеся айди
const path = require('path')
const {Radio} = require("../models/radio");
const {Types} = require("mongoose");
const {Genre} = require("../models/genre");
const {Country} = require("../models/country");
const {Language} = require("../models/language");
const fs = require('fs');
const http = require('http');

const icy = require('icy');


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
            let genre = await Genre.findById(req.body.genre_id);
            genre.numberOfRS = genre.numberOfRS + 1;
            await genre.save();
            return res.status(201).send({message: "Радиостанция добавлена успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getAll(req, res) {
        try {
            let {country_id, genre_id, page, limit, searchName} = req.query
            let offset = page * limit - limit
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
            const count = resultCount
            return res.json([radioStations, count])
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getOne(req, res) {
        const id = req.params.id;
        if (!id) res.status(400).json('None Id')
        try {
            let radioStation = await Radio.findById(id)
            let genre = await Genre.findById(radioStation.genre.toString())
            let country = await Country.findById(radioStation.country.toString())
            let language = await Language.findById(radioStation.language.toString())
            return res.json([radioStation, genre, country, language])
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async getFavorites(req, res) {
        let ids = req.body.ids; // ids - это массив id, переданный из клиента, разделенный запятыми
        try {
            const regex = /[\[\]"]/g;
            ids = ids.replace(regex, '');
            // Преобразуем массив строковых id в массив чисел
            const idArray = ids.split(',').map(id => Types.ObjectId(id));

            // Находим записи в MongoDB по переданным id
            const records = await Radio.find({_id: {$in: idArray}});
            res.json(records);
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async getRadioMetadata(req, res) {
        try {
            const url = req.body.radio;
            if (!url) res.status(400).json('None url')
            let radioStation = await Radio.findById(req.body.id);
            radioStation.onlineCount = radioStation.onlineCount + 1;
            await radioStation.save()
            const parsedMetadata = await new Promise((resolve, reject) => {
                icy.get(url, (res) => {
                    res.on('metadata', (metadata) => {
                        const parsedMetadata = icy.parse(metadata);
                        resolve(parsedMetadata);

                    });
                    res.on('error', (err) => {
                        reject(err);
                    });
                });
            });

            console.log(parsedMetadata)
            return res.json(parsedMetadata);
        } catch (err) {
            console.error('Ошибка при получении потока:', err);
            return res.status(500).json({success: false, error: 'Internal server error'});
        }
    }


    // async getAudioBitrate(req, res) {
    //     const url = req.body.radio;
    //     if (!url) res.status(400).json('None url');
    //
    //     try {
    //         const request = http.get(url, (response) => {
    //             const icyMetaInt = response.headers['icy-metaint'];
    //             let icyMetadata = '';
    //             let bitRate = null;
    //
    //             response.on('data', (chunk) => {
    //                 if (!bitRate && icyMetaInt && icyMetadata.length < icyMetaInt) {
    //                     icyMetadata += chunk.toString();
    //                 } else if (!bitRate && icyMetaInt && icyMetadata.length === icyMetaInt) {
    //                     // Обработка метаданных
    //
    //                     const metadataStr = icyMetadata.slice(icyMetadata.indexOf('StreamTitle=') + 12);
    //                     const metadataArr = metadataStr.split(';');
    //                     const title = metadataArr[0].trim();
    //                     const artist = metadataArr[1] ? metadataArr[1].trim() : '';
    //                     console.log('Title:', title);
    //                     console.log('Artist:', artist);
    //
    //                     // Получение битрейта из метаданных (если предоставлен)
    //                     const bitrateMatch = /bitrate=(\d+)/i.exec(metadataArr.join(';'));
    //                     bitRate = bitrateMatch ? parseInt(bitrateMatch[1]) : null;
    //                     console.log('Bitrate:', bitRate, 'kbps');
    //                     return res.json(bitRate);
    //                 }
    //             });
    //         });
    //
    //         request.on('error', (error) => {
    //             console.error('Ошибка при получении метаданных:', error);
    //             return res.status(500).json({ success: false, error: 'Error getting metadata' });
    //         });
    //     } catch (err) {
    //         console.error('Ошибка при получении потока:', err);
    //         return res.status(500).json({ success: false, error: 'Internal server error' });
    //     }
    // }


    async delete(req, res) {
        try {
            const {id} = req.body
            if (!id) res.status(400).json('None Id')
            const deletedDocument = await Radio.findByIdAndDelete(id);
            let genre = await Genre.findById(deletedDocument.genre);
            genre.numberOfRS = genre.numberOfRS - 1;
            await genre.save();
            fs.unlink(path.resolve(__dirname, '..', 'static', deletedDocument.image), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`${path.resolve(__dirname, '..', 'static', deletedDocument.image)} успешно удален.`);
            });
            if (!deletedDocument) {
                return res.status(404).json({message: 'Document not found'});
            }
            return res.status(200).json({message: 'Document deleted'});
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async update(req, res) {
        try {
            let radio = await Radio.findById(req.body.id);
            if (!radio) return res.status(409).send({message: "Радиостанция с данным названием не существует!"});
            let fileName = req.body.imageName
            if (req.files !== null) {
                fs.unlink(path.resolve(__dirname, '..', 'static', fileName), (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(`${path.resolve(__dirname, '..', 'static', fileName)} успешно удален.`);
                });
                let {image} = req.files
                fileName = uuid.v4() + ".jpg"
                await image.mv(path.resolve(__dirname, '..', 'static', fileName))

            }
            if (radio.genre !== req.body.genre) {
                let genre = await Genre.findById(radio.genre);
                genre.numberOfRS = genre.numberOfRS - 1;
                await genre.save();

                genre = await Genre.findById(req.body.genre_id);
                genre.numberOfRS = genre.numberOfRS + 1;
                await genre.save();
            }
            radio.title = req.body.title
            radio.radio = req.body.radio
            radio.language = req.body.language_id
            radio.genre = req.body.genre_id
            radio.country = req.body.country_id
            radio.image = fileName
            await radio.save()
            return res.status(201).send({message: "Радиостанция обновлена успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }
}


module.exports = new RadioController()
