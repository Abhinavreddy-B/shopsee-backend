/* eslint-disable no-undef */
require('dotenv').config()

const MongoUri = process.env.MONGODB_URI
const Port = process.env.PORT
const Salt = process.env.PORT
const ImgPubKey = process.env.IMAGEKIT_publicKey
const ImgPrivKey = process.env.IMAGEKIT_privateKey
const ImgBaseUrl = process.env.IMAGEKIT_urlEngpoint

module.exports = { MongoUri, Port, Salt, ImgPubKey, ImgPrivKey, ImgBaseUrl }