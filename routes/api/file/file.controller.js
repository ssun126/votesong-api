const aws = require('aws-sdk')
const createError = require('http-errors')
const config = require('../../../config')
const MpFile = require('../../../models/mpfile')


/*
    GET /api/file/list
*/
exports.list = (req, res, next) => {
   try {
        MpFile.find({}, '').exec()
            .then(
                files=> {
                    res.json({files})
                }
            )
    } catch (err) {
        return next(err)
    }
}

/*
    POST /api/file/info
*/
exports.info = async (req, res, next) => {
    console.log("body", req.body)
    const title = req.body.title

    try {
        const sameTitle = await MpFile.findByTitle(title)
        if(sameTitle.length > 0) {
            return next(createError(500, 'title 이 이미 있습니다.'))
        } else {
            const result = await MpFile.create(req.body)
            return res.json(result)
        }
    } catch (err) {
        return next(err)
    }
}
/*
    POST /api/file/upload
*/
exports.upload = async (req, res, next) => {
    console.log("file", req.file)
    const file = req.file

    //라우터에 Multer 객체를 연결하면 input name이 일치하는 파일 데이터를 자동으로 받아서 req.file를 통해 접근할 수 있게 처리해 줍니다.
    //메모리 버퍼에 저장하는 형태를 선택했으므로 fileObj는 다음과 같은 속성을 갖게 됩니다.
    // req.file.buffer //예) Buffer 객체
    // req.file.originalname //예) abc.jpg
    // req.file.mimetype //예)'image/jpeg'

    //아마존 S3에 저장하려면 먼저 설정을 업데이트합니다.
    aws.config.region = 'ap-northeast-2' //Seoul
    aws.config.update({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    })

    try {
        var s3_params = {
            Bucket: config.bucket,
            Key: req.file.originalname,
            ACL: 'public-read',
            ContentType: req.file.mimetype
        }

        let s3obj = new aws.S3({ params: s3_params })
        s3obj.upload({ Body: req.file.buffer }).
        on('httpUploadProgress', function (evt) { console.log(evt) }).
        send(function (err, data) {
            //S3 File URL
            let url = data.Location
            //어디에서나 브라우저를 통해 접근할 수 있는 파일 URL을 얻었습니다.
            console.log('url>>>>>>>>>>>'+url)
            res.send(url) // url 리턴함
        })

    } catch (err) {
        return next(err)
    }
}
