const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    name: String,
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    },
    price: Number,
    stock: Number,
    image: String,
})

ItemSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Item = mongoose.model('Item', ItemSchema)

module.exports = Item