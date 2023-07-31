const Router = require('express')
const router = new Router()
const genreController = require('../controller/genreController')

router.get('/', genreController.getAll)
router.post('/', genreController.create)
router.post('/delete', genreController.delete)

module.exports = router