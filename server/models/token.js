const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Token = new Schema({
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("token", Token);
