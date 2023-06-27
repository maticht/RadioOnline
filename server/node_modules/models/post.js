const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Post = new Schema({
    title: {type: String, trim: true, required: true,},
    parent: {type: String, trim: true, required: true,},
    postedBy: {type: String, trim: true,},
    prise: {type: String, trim: true, required: true,},
    fixPrice: {type: String, trim: true, required: true,},
    minutes: {type: String, trim: true, required: true,},
    hours: {type: String, trim: true, required: true,},
    days: {type: String, trim: true, required: true,},
    fixTime: {type: String, trim: true, required: true,},
    description: {type: String, trim: true, required: true,}
},
    {timestamps: true}
);

module.exports = mongoose.model('Post', Post)
