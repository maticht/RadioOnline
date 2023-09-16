const Router = require('express')
const router = new Router()
const radioController = require('../controller/radioController')

router.get('/', radioController.getAll)
router.get('/:id', radioController.getOne)
router.get('/link/:link', radioController.getOneByLink)
router.post('/', radioController.create)
router.post('/delete/:id', radioController.delete)
router.post('/musicName/:id', radioController.getRadioMetadata)
<<<<<<< HEAD
router.get('/onlineP/:id', radioController.onlinePlus)
router.get('/onlineM/:id', radioController.onlineMinus)
=======
router.post('/favorites', radioController.getFavorites)
>>>>>>> deb7e21556671a12e89aeb549aaf0eb6dbd58a31
router.post('/upd', radioController.update)

module.exports = router
