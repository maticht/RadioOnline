const {Radio} = require("../models/radio");
const radioOnlineMap = require("../models/radioOnlineMap")
const intervalTime = 10000; // 4 секунды
let radios;

async function fillMap() {
    try {
        radios = await Radio.find();
        radios.forEach(radio => {
            radioOnlineMap.set(radio.id, 0);
        });
        console.log(radioOnlineMap)
    } catch (error) {
        console.log('Ошибка при заполнения массива с онлайном":', error);
    }
}

async function updateOnlineField() {
    try {
        if (!radios || radios.length === 0) {
            console.log('Нет записей в базе данных "radio".');
            return;
        }
        if(radios.length !== radioOnlineMap.size){
            radios = await Radio.find();
        }
        const updatedRadios = radios.map((radio) => {
            const onlineCount = radioOnlineMap.get(radio.id); //получение пингов дла радиостанции с необходимым айди из мапы
            radioOnlineMap.set(radio.id, 0);// обнуляем счетчик пингов длая радиостанции с необходимым айди в мапе
            const updatedOnline = Math.round(onlineCount / 4); // считаем сколько людей на радиостанции
            console.log(`Для "${radio.title}" в бд было записано: ${onlineCount} пингов.`)
            return {...radio._doc, online: updatedOnline}; // возвращаем это количество
        });

        await Promise.all(updatedRadios.map((radio) => Radio.updateOne({_id: radio._id}, {
            $set: {
                online: radio.online,
            }
        })));

        console.log('Поле "online" в записях базы данных "radio" успешно обновлено.');
    } catch (error) {
        console.log('Ошибка при обновлении поля "online":', error);
    }
}

function onlineUpdater() {
    fillMap();
    setInterval(updateOnlineField, intervalTime);
}

module.exports = onlineUpdater;