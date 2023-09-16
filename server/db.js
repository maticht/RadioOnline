const mongoose = require("mongoose");
mongoose.set('strictQuery', false);


module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        mongoose.connect('mongodb+srv://radionline:2zuhhzsHM2FXbouz@clusterro.j51sgqt.mongodb.net/', connectionParams);
        console.log("Connected to database successfully");
    } catch (error) {
        console.log(error);
        console.log("Could not connect database!");
    }
};
