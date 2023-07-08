const { Radio } = require("../models/radio");
const icy = require("icy");

exports.getAllRadios = async(req,res) => {

    let url = 'http://pool.anison.fm:9000/AniSonFM(320)';

    try {
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

        return res.json(parsedMetadata);
    } catch (err) {
        console.error('Ошибка при получении потока:', err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}


