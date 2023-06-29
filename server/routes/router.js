const Router = require('express');
const router = new Router();
const {getAllUsers, deleteRadio} = require('../controller/controller');

router.get('/getAllUsers',getAllUsers)
router.get('/deleteRadio/:ServId/', deleteRadio)

//module.exports = router
