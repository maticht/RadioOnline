const Router = require('express')
const router = new Router()
const customMessageController = require('../controller/customMessageController')

router.get('/', customMessageController.getAll)
router.post('/', customMessageController.create )
router.post('/delete', customMessageController.delete)

module.exports = router
