const express = require('express');
const rout = require('./routes/router');
require("dotenv").config();
const cors = require("cors");
const app = express();
const router = require('./routes/index')
const radioRoutes = require("./models/createRadio");
const addingRating = require("./models/addingRating")
const fileUpload = require('express-fileupload')
const connection = require("./db");
const path = require("path");

connection();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use("/addingRating", addingRating);
app.use('/api', router)


const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
