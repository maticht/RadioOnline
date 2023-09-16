const {Radio} = require("../models/radio");
const path = require('path');
const intervalTime = 300000; // 5 мин
const ffmpeg = require('fluent-ffmpeg');


// // Указываем пути к исполняемым файлам FFmpeg и ffprobe
const ffmpegRelativePath = '../FFmpeg/bin/ffmpeg';
const ffprobeRelativePath = '../FFmpeg/bin/ffprobe';

const ffmpegPath = path.resolve(__dirname, ffmpegRelativePath);
const ffprobePath = path.resolve(__dirname, ffprobeRelativePath);

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

async function getAudioBitrateFromStream(streamUrl) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(streamUrl, (err, metadata) => {
            if (err) {
                console.error(`Ошибка при получении метаданных для ${streamUrl}`);
                reject(err);
            } else {
                const format = metadata.format;
                const bitRate = format && format.bit_rate ? parseInt(format.bit_rate) / 1000 : null;
                resolve(bitRate);
            }
        });
    });
}

async function updateBitrateForRadios() {
    try {
        const radios = await Radio.find();
        if (!radios || radios.length === 0) {
            console.log('Нет записей в базе данных "radio".');
            return;
        }
        for (const radio of radios) {
            try {
                const bitRate = await getAudioBitrateFromStream(radio.radio);
                await Radio.updateOne({_id: radio._id}, {$set: {bitrate: bitRate}});
                console.log(`Битрейт для радиостанции с ID ${radio._id} успешно обновлен: ${bitRate} kbps`);
            } catch (error) {
                console.log(`Ошибка при обновлении битрейта для радиостанции с ID ${radio._id}:`);
            }
        }
    } catch (error) {
        console.log('Ошибка при обновлении битрейта для радиостанций:');
    }
}

function bitrateUpdater() {
    updateBitrateForRadios();
    setInterval(() => {
        updateBitrateForRadios();
    }, intervalTime);
}

module.exports = bitrateUpdater;
