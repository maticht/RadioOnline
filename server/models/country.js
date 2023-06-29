const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: { type: String, required: false },
}, {toJSON: {virtuals: true}});

const Country = mongoose.model("Country", countrySchema);

module.exports = {Country};