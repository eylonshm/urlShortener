const express = require('express')
var router = express.Router()
const shortUrl = require('./models/shortUrl')
const urlValidation = require('./utils/urlValidation')
const fetch = require('node-fetch')

router.get('/', (req, res) => {
    res.send('Url Shortener')
})

router.post('/urlShorten', async (req, res) => {
    fullUrl = req.body.fullUrl
    try {
        if (urlValidation(fullUrl)) {
            const response = await fetch(fullUrl)
            const responseText = await response.text()
            const title = responseText.split('<title>')[1].split('</title>')[0]

            const createdUrl = await shortUrl.create({ full: fullUrl, title: title })
            res.send({ created: createdUrl })
        } else {
            res.send(500, { error: "Cant shorten this url, check it's validation" })
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(402)
    }
})
router.get('/getAllUrls', async (req, res) => {
    const urlsList = await shortUrl.find()
    res.send({ urls: urlsList })
})

router.get('/getUrls', async (req, res) => {
    // those are strings
    start = req.query._start
    limit = req.query._limit
    try {
        if (start && limit) {
            docsLimit = parseInt(limit)
            docsToSkip = parseInt(start)
            const urlsList = await shortUrl.find({}).sort({ createdAt: -1 }).limit(docsLimit).skip(docsToSkip)
            // const urls = urlsList.docs
            res.send({ urls: urlsList })
        } else {
            res.sendStatus(404)
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(404)
    }
})

router.get('/:shortUrl', async (req, res) => {
    try {
        const urlDoc = await shortUrl.findOne({ short: req.params.shortUrl })
        if (urlDoc === null) return res.sendStatus(404)
        urlDoc.clicks++
        urlDoc.save()
        res.redirect(urlDoc.full)
    } catch (err) {
        res.sendStatus(404)
        console.log(err)
    }
})

module.exports = router
