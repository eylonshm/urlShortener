const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()
const routes = require('./routes')
var cors = require('cors')
const port = process.env.PORT || 6000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(routes)
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    mongoose
        .connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('connected to mongoDB')
        })
        .catch((err) => {
            console.log('db Connection failed')
            console.log(err)
        })
})
