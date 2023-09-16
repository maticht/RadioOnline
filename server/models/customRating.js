const mongoose = require('mongoose');
const moment = require("moment-timezone");

const customRatingSchema = new mongoose.Schema({
    value: {type: Number, default: 0, required: false},
    description: { type: String, required: false },
    name: { type: String, required: false },
    email: { type: String, required: false },
    commentatorId: { type: String, required: false },
    created: {
        type: Date,
        default: () => moment.tz('Europe/Moscow').add(1, 'hours').toDate()
    }
}, {toJSON: {virtuals: true}});

const customRating = mongoose.model("CustomRating", customRatingSchema);

module.exports = {customRating};
