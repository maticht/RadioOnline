const Router = require('express')
const router = new Router()
const radioController = require('../controller/radioController')

router.get('/', radioController.getAll)
router.post('/', radioController.create)
router.post('/delete/:id', )

module.exports = router