const mongoose = require('mongoose');

const customErrorSchema = new mongoose.Schema({
    text: { type: String, required: false },
    radioStationName: {type: String, required: false},
    radioStationLink: {type: String, required: false},
    time: { type: Date, default: Date.now()}
}, {toJSON: {virtuals: true}});

const CustomError = mongoose.model("CustomError", customErrorSchema);

module.exports = {CustomError};