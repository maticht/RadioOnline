const Router = require('express')
const router = new Router()
const customRatingController = require('../controller/customRatingController')

router.get('/', customRatingController.getAll)
router.post('/', customRatingController.create )
router.post('/delete', customRatingController.delete)

module.exports = router
