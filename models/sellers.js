const mongoose = require('mongoose')

const SellerSchema = new mongoose.Schema({
    userName: String,
    passwordHash: String,
    Name: String,
    Items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ]
})

SellerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})


const Seller = mongoose.model('Seller', SellerSchema)

module.exports = Seller