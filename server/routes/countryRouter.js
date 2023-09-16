const Router = require('express')
const router = new Router()
const countryController = require('../controller/countryController')

router.get('/', countryController.getAll)
router.post('/', countryController.create )
router.post('/delete', countryController.delete)

module.exports = router
