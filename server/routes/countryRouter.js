const Router = require('express')
const router = new Router()
const countryController = require('../controller/countryController')

router.get('/', countryController.getAll)
router.post('/', countryController.create )
router.get('/delete/:id', countryController.delete)

module.exports = router
