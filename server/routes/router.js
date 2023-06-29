const Router = require('express');
const router = new Router();
const {getAllRadios} = require('../controller/controller');

router.get('/getAllRadios',getAllRadios)

module.exports = router
