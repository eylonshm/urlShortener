const mongoose = require('mongoose')
const shortId = require('shortid')
const mongoosePaginate = require('mongoose-paginate-v2')

const ShortUrl = mongoose.Schema(
    {
        full: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        short: {
            type: String,
            required: true,
            default: shortId.generate,
        },
        clicks: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
)

ShortUrl.plugin(mongoosePaginate)

module.exports = mongoose.model('Url', ShortUrl)
