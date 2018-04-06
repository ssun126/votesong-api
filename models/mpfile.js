const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MpFile = new Schema({
    title: String,
    singer : String,
    fileUrl : String,
    order : Number,
    display : { type: Boolean, default: true },
    vote : [String],
    party: [String],
    recommend: [String],
    age: [String],
    region : [String],
    genre : [String],
    copyType : [String],
    voice : [String],
    price : {
        clone : Number,
        copyright : Number,
        makePrice : Number,
        totalPrice : Number
    },
    lyrics: String,
    update : Date
})


// create new Mpfile document
MpFile.statics.create = function(formData) {

    const MpFile = new this({
        title : formData.title,
        singer: formData.singer,
        fileUrl : formData.fileUrl,
        order: formData.order,
        display : formData.display,
        vote: formData.vote,
        party : formData.party,
        recommend: formData.recommend,
        age : formData.age,
        region: formData.region,
        genre : formData.genre,
        copyType: formData.copyType,
        voice : formData.voice,
        clone: formData.clone,
        copyright : formData.copyright,
        makePrice: formData.makePrice,
        totalPrice : formData.totalPrice,
        lyrics: formData.lyrics,
        update :new Date
    })

    // return the Promise
    return MpFile.save()
}

// find one Mpfile by using title
MpFile.statics.findByTitle = function(title) {
    console.log('title', title)
    return this.find({
        title
    }).exec()
}

module.exports = mongoose.model('MpFile', MpFile)