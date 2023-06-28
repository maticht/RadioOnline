const Router = require('express')
const router = new Router()
const languageController = require('../controller/languageController')

router.get('/', languageController.getAll)
router.post('/', languageController.create )
router.get('/delete/:id', languageController.delete)

module.exports = router