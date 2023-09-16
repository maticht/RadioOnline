const uuid = require('uuid') // генерирует рандомные неповторяющиеся айди
const path = require('path')
const {Radio} = require("../models/radio");
const {Types} = require("mongoose");
const {Genre} = require("../models/genre");
const {Country} = require("../models/country");
const {Language} = require("../models/language");
const radioOnlineMap = require("../models/radioOnlineMap")
const fs = require('fs');
const icy = require("icy");
const ffmpeg = require('fluent-ffmpeg');
const {json} = require("react-router-dom");


const ffmpegPath = '../FFmpeg/bin/ffprobe';
const ffprobePath = '../FFmpeg/bin/ffprobe';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

async function getAudioMetadataFromStream(streamUrl) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(streamUrl, (err, metadata) => {
            if (err) {
                console.error(`Ошибка при получении метаданных для ${streamUrl}`);
                reject(err);
            } else {
                const format = metadata.format;
                resolve(format);
            }
        });
    });
}

async function getIcyMetadataFromStream(streamUrl) {
    const meta = new Promise((resolve, reject) => {
        icy.get(streamUrl, (res) => {
            res.on("metadata", (metadata) => {
                const parsedMetadata = icy.parse(metadata);
                resolve(parsedMetadata);
            });
            res.on("error", (error) => {
                console.log(error.message);
                reject(error);
            });
        });
    });
    return res.json(meta);
}


class RadioController {
    async create(req, res, next) {
        try {
            let radio = await Radio.findOne({title: req.body.title});
            if (radio) return res.json({status: 409, message: "Радиостанция с данным названием уже существует!"});
            radio = await Radio.findOne({radioLinkName: req.body.radioLinkName});
            if (radio) return res.json({status: 409, message: `Ссылка занята радиостаницей: ${radio.title}`})

            const {image} = req.files
            let fileName = uuid.v4() + ".jpg"
            await image.mv(path.resolve(__dirname, '..', 'static', fileName))
            radio = await new Radio({
                title: req.body.title,
                radio: req.body.radio,
                radioLinkName: req.body.radioLinkName,
                language: req.body.language_id,
                genre: req.body.genre_id,
                country: req.body.country_id,
                image: fileName,
            }).save();
            radioOnlineMap.set(radio.id, 0);
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


    async getOneByLink(req, res) {
        const link = req.params.link;
        if (!link) res.status(400).json('None Link')
        try {
            let radioStation = await Radio.findOne({radioLinkName: link})
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
        const url = req.body.radio;
        const id = req.body.id;
        try {
            if (!url) res.status(400).json('None url')
            if (radioOnlineMap.has(id)) {
                const onlineCount = radioOnlineMap.get(id);
                radioOnlineMap.set(id, onlineCount + 1);
                // return res.status(200);
            } else {

                console.log('Объект с указанным id не найден.');
                // return res.status(200);
            }
        } catch (e) {
            console.log(e)
            return res.status(500).json({success: false, error: 'Internal server error'});
        }

        try {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
            let meta;
            meta = await new Promise((resolve, reject) => {
                icy.get(url, (response) => {
                    response.on("metadata", (metadata) => {
                        const parsedMetadata = icy.parse(metadata);
                        resolve(parsedMetadata);
                    });
                    response.on("error", (error) => {
                        console.log(error.message);
                        resolve({StreamTitle: 'Неизвестно'})
                    });
                });
            });
            console.log(meta);
            return res.json(meta);
        } catch (err) {
            console.error('Ошибка внутри try-catch:', err);
            return res.status(500).json({success: false, error: 'Internal server error'});
        }


        // try {
        //     const metadata = await getAudioMetadataFromStream(url);
        //     console.log(metadata);
        //     if (metadata.tags.StreamTitle) {
        //         console.log(metadata)
        //         return res.json({StreamTitle: metadata.tags.StreamTitle});
        //     } else {
        //         return res.json({StreamTitle: 'Неизвестно'});
        //     }
        // } catch (err) {
        //     console.error('Ошибка внутри try-catch:', err);
        //     return res.status(500).json({success: false, error: 'Internal server error'});
        // }
    }


    async delete(req, res) {
        try {
            const {id} = req.body
            if (!id) res.status(400).json('None Id')
            const deletedDocument = await Radio.findByIdAndDelete(id);
            radioOnlineMap.delete(id)
            console.log(radioOnlineMap);
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
            console.log(req.body)
            let radio = await Radio.findOne({radioLinkName: req.body.radioLinkName});
            if (radio !== null) {
                if (req.body.id !== radio.id)
                    return res.json({status: 409, message: `Ссылка занята радиостаницей: ${radio.title}`})
            }
            radio = await Radio.findById(req.body.id);
            if (!radio) return res.json({status: 409, message: "Радиостанция с данным названием не существует!"});
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
            radio.radioLinkName = req.body.radioLinkName
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
