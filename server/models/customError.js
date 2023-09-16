const mongoose = require('mongoose');
const moment = require('moment-timezone');

const customErrorSchema = new mongoose.Schema({
    text: { type: String, required: false },
    radioStationName: {type: String, required: false},
    radioStationLink: {type: String, required: false},
    time: {
        type: Date,
        default: () => moment.tz('Europe/Moscow').add(1, 'hours').toDate()
    }
}, {toJSON: {virtuals: true}});

const CustomError = mongoose.model("CustomError", customErrorSchema);

module.exports = {CustomError};
