const express = require('express');
const rout = require('./router');
require("dotenv").config();
const cors = require("cors");
const app = express();
const radioRoutes = require("./models/createRadio");
const addingRating = require("./models/addingRating")
const connection = require("./db");

connection();

app.use(cors());
app.use(express.json());
app.use(rout);
app.use("/createRadio", radioRoutes);
app.use("/addingRating", addingRating);



const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
