const Router = require('express')
const router = new Router()
const genreController = require('../controller/genreController')

router.get('/', genreController.getAll)//comment
router.post('/', genreController.create)
router.get('/delete/:id', genreController.delete)

module.exports = router