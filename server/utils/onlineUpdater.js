const {Radio} = require("../models/radio");
const intervalTime = 20000; // 20 секунд

async function updateOnlineField() {
    try {
        const radios = await Radio.find();
        if (!radios || radios.length === 0) {
            console.log('Нет записей в базе данных "radio".');
            return;
        }

        const updatedRadios = radios.map((radio) => {
            const updatedOnline = Math.round(radio.onlineCount / 4);
            return {...radio._doc, online: updatedOnline, onlineCount: 0};
        });

        await Promise.all(updatedRadios.map((radio) => Radio.updateOne({_id: radio._id}, {
            $set: {
                online: radio.online,
                onlineCount: radio.onlineCount
            }
        })));

        console.log('Поле "online" в записях базы данных "radio" успешно обновлено.');
    } catch (error) {
        console.log('Ошибка при обновлении поля "online":', error);
    }
}


function onlineUpdater() {
    setInterval(updateOnlineField, intervalTime);
}

module.exports = onlineUpdater;