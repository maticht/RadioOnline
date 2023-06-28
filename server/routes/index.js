const Router = require('express')
const router = new Router()
const genreRouter = require('./genreRouter')
const adminRouter = require('./adminRouter')
const countryRouter = require('./countryRouter')
const radioRouter = require('./radioRouter')
const ratingRouter = require('./ratingRouter')
const languageRouter = require('./languageRouter')


router.use('/genre', genreRouter)
router.use('/country', countryRouter)
router.use('/language', languageRouter)
router.use('/radio', radioRouter)
router.use('/rating', ratingRouter)
router.use('/admin', adminRouter)

module.exports = router