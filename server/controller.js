const { Radio } = require("./models/radio");

exports.deleteRadio = async (req, res) => {
    try{
        const deleted = await Radio.findByIdAndRemove(req.params.ServId);
        res.json(`DELETED SACSESS ${deleted}`);
    }catch (err){
        console.log(err);
    }
}


exports.getAllUsers = async(req,res) => {
    const radios = await Radio.find()
    res.json(radios)
}

