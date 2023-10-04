const uuid = require('uuid') // генерирует рандомные неповторяющиеся айди
const path = require('path')
const {Radio} = require("../models/radio");
const {Types} = require("mongoose");
const {Genre} = require("../models/genre");
const {Country} = require("../models/country");
const {Language} = require("../models/language");
const radioOnlineMap = require("../models/radioOnlineMap")
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const icy = require('icy')
const {parse} = require("icy");

// const ffmpegPath = 'http://backend.delkind.pl/ffmpeg-2023-07-16-git-c541ecf0dc-full_build/bin/ffprobe.exe';
// const ffprobePath = 'http://backend.delkind.pl/ffmpeg-2023-07-16-git-c541ecf0dc-full_build/bin/ffprobe.exe';
//
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

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
    return meta
}

const radioStationsWithoutSelected = (arrayFromDB, selectedRadioId, limit) => {

    const resultArr = [];
    let counter = 0;
    for(const item of arrayFromDB){
        if(item.id === selectedRadioId){
            continue;
        }
        if(counter === parseInt(limit)){
            break;
        }
        resultArr.push(item);
        counter++;
    }
    return resultArr;
}


class RadioController {
    async create(req, res, next) {
        console.log(req.body);
        try {
            let radio = await Radio.findOne({title: req.body.title});
            if (radio) return res.json({status: 409, message: "Радиостанция с данным названием уже существует!"});
            radio = await Radio.findOne({radioLinkName: req.body.radioLinkName});
            if (radio) return res.json({status: 409, message: `Ссылка занята радиостаницей: ${radio.title}`})

            const {image} = req.files
            let fileName = uuid.v4() + ".jpg"
            await image.mv(path.resolve(__dirname, '..', 'static', fileName))

            const genresIdsString = req.body.genre_id;
            radio = await new Radio({
                title: req.body.title,
                radio: req.body.radio,
                radioLinkName: req.body.radioLinkName,
                language: req.body.language_id,
                genre: genresIdsString,
                country: req.body.country_id,
                image: fileName,
            }).save();
            radioOnlineMap.set(radio.id, 0);
            const genresIdsStringArr = genresIdsString.split(",");
            for(const genreId of genresIdsStringArr){
                let genre = await Genre.findById(genreId);
                genre.numberOfRS = genre.numberOfRS + 1;
                await genre.save();
            }
            return res.status(201).send({message: "Радиостанция добавлена успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getAll(req, res) {
        try {
            let {country_id, genre_id, page, limit, searchName, radio_id, bitrate} = req.query
            console.log("поисковое слово " + searchName);
            console.log("поисковое айди радио " + radio_id);
            console.log(genre_id);
            const genreIds = genre_id ? genre_id.split(',') : [];
            console.log(genreIds)
            const genreRegex = new RegExp(genreIds.join('|'));
            let offset = page * limit - limit
            let radioStations = [];
            let resultCount;
            if (radio_id === '' || typeof radio_id === 'undefined') {

                if (searchName === '') {
                    console.log('Попал сюда')
                    if (!country_id && genreIds.length === 0) {
                        radioStations = await Radio.find().skip(offset).limit(limit);
                        resultCount = await Radio.countDocuments();
                    } else if (country_id && genreIds.length === 0) {
                        radioStations = await Radio.find({country: new Types.ObjectId(country_id)}).skip(offset).limit(limit);
                        resultCount = await Radio.countDocuments({country: new Types.ObjectId(country_id)});
                    } else if (!country_id && genreIds.length !== 0) {
                        const genreRegex = new RegExp(genreIds.join('|'));
                        radioStations = await Radio.find({ genre: { $regex: genreRegex } }).skip(offset).limit(limit);
                        resultCount = await Radio.countDocuments({genre: { $regex: genreRegex }});
                    } else if (country_id && genreIds.length !== 0) {
                        radioStations = await Radio.find({
                            country: new Types.ObjectId(country_id),
                            genre: { $regex: genreRegex }
                        }).skip(offset).limit(limit);
                        resultCount = await Radio.countDocuments({
                            country: new Types.ObjectId(country_id),
                            genre: { $regex: genreRegex }
                        });
                    }
                } else {
                     if (!country_id && genreIds.length === 0) {
                        let query = {title: {$regex: searchName, $options: 'i'}};
                        radioStations = await Radio.find(query).skip(offset).limit(limit);
                        resultCount = await Radio.countDocuments(query);
                    } else if (country_id && genreIds.length === 0) {
                        let query = {
                            title: {$regex: searchName, $options: 'i'},
                            country: new Types.ObjectId(country_id)
                        };
                        radioStations = await Radio.find(query).skip(offset).limit(limit);
                        resultCount = await Radio.countDocuments(query);
                    } else if (!country_id && genreIds.length !== 0) {
                        let query = {
                            title: {$regex: searchName, $options: 'i'},
                            genre: {$regex: genreRegex}
                        };
                        radioStations = await Radio.find(query).skip(offset).limit(limit);
                        resultCount = await Radio.countDocuments(query);
                    } else if (country_id && genreIds.length !== 0) {
                        let query = {
                            title: {$regex: searchName, $options: 'i'},
                            country: new Types.ObjectId(country_id),
                            genre: { $regex: genreRegex }
                        };
                        radioStations = await Radio.find(query).skip(offset).limit(limit);
                        resultCount = await Radio.countDocuments(query);
                    }
                }
            }else {
                if (searchName === '') {
                    if (!country_id && genreIds.length === 0) {
                        radioStations = await Radio.find().skip(offset).limit(limit);
                        resultCount = await Radio.countDocuments();
                    } else if (country_id && genreIds.length === 0) {

                        const radioStationsTemp = await Radio.find({country: new Types.ObjectId(country_id)}).skip(offset);
                        radioStations = radioStationsWithoutSelected(radioStationsTemp, radio_id, limit);
                        resultCount = await Radio.countDocuments({country: new Types.ObjectId(country_id)});

                    } else if (!country_id && genreIds.length !== 0) {

                        const radioStationsTemp = await Radio.find({genre: { $regex: genreRegex }}).skip(offset);
                        radioStations = radioStationsWithoutSelected(radioStationsTemp, radio_id, limit);
                        resultCount = await Radio.countDocuments({genre: { $regex: genreRegex }});
                    } else if (country_id && genreIds.length !== 0) {

                        const radioStationsTemp = await Radio.find({
                            country: new Types.ObjectId(country_id),
                            genre: { $regex: genreRegex }
                        }).skip(offset);

                        radioStations = radioStationsWithoutSelected(radioStationsTemp, radio_id, limit);

                        resultCount = await Radio.countDocuments({
                            country: new Types.ObjectId(country_id),
                            genre: { $regex: genreRegex }
                        });
                    }
                } else {
                    if (!country_id && genreIds.length === 0) {

                        let query = {title: {$regex: searchName, $options: 'i'}};
                        const radioStationsTemp = await Radio.find(query).skip(offset).limit(limit);
                        radioStations = radioStationsWithoutSelected(radioStationsTemp, radio_id, limit);
                        resultCount = await Radio.countDocuments(query);
                    } else if (country_id && genreIds.length === 0) {
                        let query = {
                            title: {$regex: searchName, $options: 'i'},
                            country: new Types.ObjectId(country_id)
                        };

                        const radioStationsTemp = await Radio.find(query).skip(offset);
                        radioStations = radioStationsWithoutSelected(radioStationsTemp, radio_id, limit);
                        resultCount = await Radio.countDocuments(query);
                    } else if (!country_id && genreIds.length !== 0) {
                        let query = {
                            title: {$regex: searchName, $options: 'i'},
                            genre: { $regex: genreRegex }
                        };
                        const radioStationsTemp = await Radio.find(query).skip(offset);
                        radioStations = radioStationsWithoutSelected(radioStationsTemp, radio_id, limit);
                        resultCount = await Radio.countDocuments(query);
                    } else if (country_id && genreIds.length !== 0) {
                        let query = {
                            title: {$regex: searchName, $options: 'i'},
                            country: new Types.ObjectId(country_id),
                            genre: { $regex: genreRegex }
                        };
                        const radioStationsTemp = await Radio.find(query).skip(offset);
                        radioStations = radioStationsWithoutSelected(radioStationsTemp, radio_id, limit);
                        resultCount = await Radio.countDocuments(query);
                    }
                }
            }
            const count = resultCount
            radioStations.sort((a, b) => b.bitrate - a.bitrate);
            console.log(radioStations);
            return res.json([radioStations, count, page])
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

            const genres = [];
            const genresIds = radioStation.genre.toString().split(",")

            for(const genreId of genresIds){
                const item = await Genre.findById(genreId);
                console.log(item, 'Достали из бд')
                genres.push(item);
            }

            console.log(genres, 'Массив жанров')
            let country = await Country.findById(radioStation.country.toString())
            let language = await Language.findById(radioStation.language.toString())
            return res.json([radioStation, genres, country, language])
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async incrementBitrate(req, res) {
        const link = req.params.link;
        if (!link) return res.status(400).json('None id');
        try {
            let radioStation = await Radio.findOne({radioLinkName: link})
            if (!radioStation) {
                return res.status(404).json({ message: 'Radio station not found' });
            }
            radioStation.bitrate += 1;
            await radioStation.save();
            console.log(link, 'Достали incrementBitrate')
            return res.json({ message: 'Bitrate incremented successfully', newBitrate: radioStation.bitrate });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async decrementBitrate(req, res) {
        const link = req.params.link;
        if (!link) return res.status(400).json('None id');
        try {
            let radioStation = await Radio.findOne({radioLinkName: link});
            if (!radioStation) {
                return res.status(404).json({ message: 'Radio station not found' });
            }
            radioStation.bitrate -= 1;
            await radioStation.save();
            console.log(link, 'Достали decrementBitrate')
            return res.json({ message: 'Bitrate decremented successfully', newBitrate: radioStation.bitrate });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }



    async getOneByLink(req, res) {
        const link = req.params.link;
        if (!link) res.status(400).json('None Link')
        try {
            let radioStation = await Radio.findOne({radioLinkName: link})
            const genres = [];
            const genresIds = radioStation.genre.toString().split(",")

            for(const genreId of genresIds){
                const item = await Genre.findById(genreId);
                console.log(item, 'Достали из бд')
                genres.push(item);
            }
            let country = await Country.findById(radioStation.country.toString())
            let language = await Language.findById(radioStation.language.toString())
            return res.json([radioStation, genres, country, language])
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async getFavorites(req, res) {
        let ids = req.body.ids; // ids - это массив id, переданный из клиента, разделенный запятыми
        let records = [];
        try {
            if(ids === null || typeof ids === "undefined" || ids === '[]'){
                return res.json(records);
            }
            const regex = /[\[\]"]/g;
            ids = ids.replace(regex, '');
            // Преобразуем массив строковых id в массив чисел
            const idArray = ids.split(',').map(id => new Types.ObjectId(id));

            // Находим записи в MongoDB по переданным id
            records = await Radio.find({_id: {$in: idArray}});
            console.log(typeof records)
            return res.json(records);
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    // async getRadioMetadata(req, res) {
    //     const url = req.body.radio;
    //     const id = req.body.id;
    //     try {
    //         if (!url) res.status(400).json('None url')
    //         if (radioOnlineMap.has(id)) {
    //             const onlineCount = radioOnlineMap.get(id);
    //             radioOnlineMap.set(id, onlineCount + 1);
    //         } else {
    //             console.log('Объект с указанным id не найден.');
    //         }
    //     } catch (e) {
    //         console.log(e)
    //         return res.status(500).json({success: false, error: 'Internal server error'});
    //     }
    //     try {
    //         const metadata = await getAudioBitrateFromStream(url);
    //         if (metadata.tags.StreamTitle) {
    //             return res.json({StreamTitle: metadata.tags.StreamTitle});
    //         } else {
    //             return res.json({StreamTitle: 'Неизвестно'});
    //         }
    //     } catch (err) {
    //         console.error('Ошибка внутри try-catch:', err);
    //         return res.status(500).json({success: false, error: 'Internal server error'});
    //     }
    // }

    async getRadioMetadata(req, res) {
        const url = JSON.parse(req.body.radio)[0].audioURL;
        const id = req.body.id;
        try {
            if (!url) res.status(400).json('None url')
            if (radioOnlineMap.has(id)) {
                const onlineCount = radioOnlineMap.get(id);
                radioOnlineMap.set(id, onlineCount + 1);
                //return res.json({StreamTitle: ''});
            } else {

                console.log('Объект с указанным id не найден.');
                //return res.json({StreamTitle: ''});
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
            //console.log(meta);
            return res.json(meta);
        } catch (err) {
            console.error('Ошибка внутри try-catch:', err);
            return res.status(500).json({success: false, error: 'Internal server error'});
        }
    }


    async delete(req, res) {
        try {
            const {id} = req.body
            if (!id) res.status(400).json('None Id')
            const deletedDocument = await Radio.findByIdAndDelete(id);
            radioOnlineMap.delete(id)
            console.log(radioOnlineMap);
            const genresIdsStringArr = deletedDocument.genre.split(",");
            for(const genreId of genresIdsStringArr){
                let genre = await Genre.findById(genreId);
                genre.numberOfRS = genre.numberOfRS - 1;
                await genre.save();
            }

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
            const genresIdsStringArrFromDB = radio.genre.split(",");
            const genresIdsStringArrUpdatedFromAdmin = req.body.genre_id.split(",");
            let genre;

            for(const genreIdFromDB of genresIdsStringArrFromDB){
                if(genresIdsStringArrUpdatedFromAdmin.includes(genreIdFromDB)){

                }else {
                    genre = await Genre.findById(genreIdFromDB);
                    genre.numberOfRS = genre.numberOfRS - 1;
                    await genre.save();
                }
            }

            for(const genreIdUpdatedFromAdmin of genresIdsStringArrUpdatedFromAdmin){
                if(genresIdsStringArrFromDB.includes(genreIdUpdatedFromAdmin)){

                }else{
                    genre = await Genre.findById(genreIdUpdatedFromAdmin);
                    genre.numberOfRS = genre.numberOfRS + 1;
                    await genre.save();
                }
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
