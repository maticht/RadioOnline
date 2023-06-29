const { Radio } = require("../models/radio");

exports.getAllRadios = async(req,res) => {
    const radios = await Radio.find()
    res.json(radios)
}

