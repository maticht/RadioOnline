const Router = require('express')
const router = new Router()
const radioController = require('../controller/radioController')

router.get('/', radioController.getAll)
router.get('/:id', radioController.getOne)
router.post('/', radioController.create)
router.post('/delete/:id', radioController.delete)
router.post('/musicName/:id', radioController.getRadioMetadata)
// router.post('/bitrate/:id', radioController.getAudioBitrate)
router.post('/favorites', radioController.getFavorites)
router.post('/upd', radioController.update)

module.exports = router
