const router = require('express').Router()
const authMiddleware = require('../../middlewares/auth')
const auth = require('./auth')
const user = require('./user')
const file = require('./file')

router.use('/auth', auth)
router.use('/user', authMiddleware)
router.use('/user', user)
router.use('/file', file)
//router.use('/file', authMiddleware)

module.exports = router