/* =======================
    LOAD THE DEPENDENCIES
==========================*/
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')



/* =======================
    LOAD THE CONFIG
==========================*/
const config = require('./config')
const port = process.env.PORT || 3001

/* =======================
    EXPRESS CONFIGURATION
==========================*/
const app = express()


/* =======================
    CONNECT TO MONGODB SERVER
==========================*/
mongoose.connect(config.mongodbUri)
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error)
db.once('open', ()=>{
    console.log('connected to mongodb server')
})


// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(cors())

// print the request log on console
app.use(morgan('dev'))

// set the secret key variable for jwt
app.set('jwt-secret', config.secret)

// index page, just for testing
app.get('/', (req, res) => {
    res.send('Hello JWT')
})

// configure api router
app.use('/api', require('./routes/api'))

// 404 에러를 잡아서 에러 던진다.
app.use(function (req, res, next) {

    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// 모든 에러를 로깅하는 미들웨어
app.use(function (err, req, res, next) {
    console.error(err)
    next(err)
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.json({error: err.message})
})

// open the server
app.listen(port, () => {
    console.log(`Express is running on port ${port}`)
})

//file Upload
//app.use(multer({ storage: memorystorage }).single('mpfile'))
