const router = require('express').Router()
const controller = require('./file.controller')
const multer = require('multer')
const memorystorage = multer.memoryStorage()
const type = multer({ storage: memorystorage }).single('mpFile')

router.get('/list', controller.list)
router.post('/info', type, controller.info)
router.post('/upload', type, controller.upload)

module.exports = router