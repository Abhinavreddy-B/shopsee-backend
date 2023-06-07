const express = require('express')
const Item = require('../models/items')
const Seller = require('../models/sellers')
const imgKit = require('../utils/ImageKit')
const middleware = require('../utils/middleware')


const ItemsRouter = express.Router()


ItemsRouter.get('/', async (req, res, next) => {
    try {
        const result = await Item.find({}).populate('seller',{Name: true,_id: true})
        return res.json(result)
    } catch (error) {
        next(error)
    }
})

ItemsRouter.post('/',middleware.tokenExtractor,middleware.sellerExtractor, async (req, res, next) => {
    const body = req.body
    body.stock = body.stock || 0
    body.seller = req.seller._id.toString()
    const item = new Item(body)

    function uploadFile(req, res) {
        if (req.file) {
            console.log("Hi")
          imgKit.upload({
            file: req.file,
            fileName: req.filename,
            folder: 'images'
          }, function(err, response) {
            if(err) {
              console.log("Failed")
            }else{
                const { url } = response
                console.log("Success",url)
                // res.json({ status: "success", message: "Successfully uploaded files" });
            }
          })
        }
    }

    try {
        uploadFile(req,res)
        const result = await item.save()
        const seller = await Seller.findById(req.seller._id.toString())

        seller.Items.push(result._id)
        await seller.save()
        return res.status(201).json(result)
    }catch(error){
        next(error)
    }
})

ItemsRouter.put('/:id',middleware.tokenExtractor,middleware.sellerExtractor, async (req,res,next) => {
    const {price , stock} = req.body
    const objectId = req.params.id

    const item = await Item.findById(objectId)
    const seller = req.seller
    // console.log(seller._id.toString(),item.seller.toString())


    if(seller._id.toString() === item.seller.toString()){
        item.price=price
        item.stock=stock
        await item.save()
        return res.status(200).json(item)
    }
    return res.status(401).json({error: "You are not allowed to delete this"})
})
module.exports = ItemsRouter