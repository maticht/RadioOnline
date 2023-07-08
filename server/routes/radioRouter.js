const Router = require('express')
const router = new Router()
const radioController = require('../controller/radioController')

router.get('/', radioController.getAll)
router.get('getRadioMetadata', radioController.getRadioMetadata)
router.get('/:id', radioController.getOne)
router.post('/', radioController.create)
router.post('/delete/:id', radioController.delete)
router.post('/upd', radioController.update)

module.exports = router
