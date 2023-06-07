const config = require('./utils/config')

const mongoose = require('mongoose')
const express = require('express')

mongoose.connect(config.MongoUri).then( () => {
    console.log('Connected to Database')
}).catch( err => {
    console.log('Unable to connect to Database')
    console.log(err)
})



const app = express()

var cors = require('cors');
app.use(cors());

var fileupload = require("express-fileupload");
app.use(fileupload())
app.use(express.json())


const middleware= require('./utils/middleware')
app.use(middleware.requestlogger)

const ItemsRouter = require('./controllers/items')
app.use('/api/items', ItemsRouter)

const SellerRouter = require('./controllers/seller')
app.use('/api/seller',SellerRouter)

const UserRouter = require('./controllers/user')
app.use('/api/user',UserRouter)

app.use(middleware.errorHandler)

module.exports = app