const mongoose = require('mongoose');

const customRatingSchema = new mongoose.Schema({
    value: {type: Number, default: 0, required: false},
    description: { type: String, required: false },
    name: { type: String, required: false },
    email: { type: String, required: false },
    commentatorId: { type: String, required: false },
    created: { type: Date, default: Date.now()}
}, {toJSON: {virtuals: true}});

const customRating = mongoose.model("CustomRating", customRatingSchema);

module.exports = {customRating};
