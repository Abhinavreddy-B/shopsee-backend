const ImageKit = require('imagekit')
const { ImgPubKey, ImgPrivKey, ImgBaseUrl } = require('./config')

const imgKit = new ImageKit({
    publicKey: ImgPubKey,
    privateKey: ImgPrivKey,
    urlEndpoint: ImgBaseUrl,
})

module.exports = imgKit