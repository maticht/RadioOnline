const Router = require('express')
const router = new Router()
const customErrorController = require('../controller/customErrorController')

router.get('/', customErrorController.getAll)
router.post('/', customErrorController.create )
router.post('/delete', customErrorController.delete)

module.exports = router
