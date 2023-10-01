const mongoose = require('mongoose');

const radioSchema = new mongoose.Schema({
    title: { type: String, required: false },
    radio: { type: String, required: false },
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language'
    },
    genre: {type: String, required: false},
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    image: {type: String, required: false},
    bitrate: {type: Number, default: 0},
    online: {type: Number, default: 0},
    radioLinkName: {type: String, default: ""},
    rating: [{
        value: {type: Number, default: 0, required: false},
        description: { type: String, required: false },
        name: { type: String, required: false },
        email: { type: String, required: false },
        commentatorId: { type: String, required: false },
        created: {type: Date, default: Date.now}
    }],
}, { toJSON: { virtuals: true } });


const Radio = mongoose.model("radio", radioSchema);


module.exports = { Radio };
