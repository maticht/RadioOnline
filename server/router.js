const Router = require('express');
const router = new Router();
const {getAllUsers, deleteRadio} = require('./controller');

router
    .get('/getAllUsers',getAllUsers)
    .get('/deleteRadio/:ServId/', deleteRadio)

module.exports = router
