const mongoose = require('mongoose');
const moment = require("moment-timezone");

const customMessageSchema = new mongoose.Schema({
    name: { type: String, required: false },
    message: { type: String, required: false },
    email: { type: String, required: false },
    created: {
        type: Date,
        default: () => moment.tz('Europe/Moscow').add(1, 'hours').toDate()
    }
}, {toJSON: {virtuals: true}});

const customMessage = mongoose.model("CustomMessage", customMessageSchema);

module.exports = {customMessage};