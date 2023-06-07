const express = require('express')
const Seller = require('../models/sellers')
const middleware = require('../utils/middleware')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const SellerRouter = express.Router()

SellerRouter.post('/signup',async (req,res,next) => {
    const {userName,password,Name} = req.body
    if(userName === undefined || password === undefined){
        res
        .status(400)
        .json({"error": "Both username and password required"})
        return
    }
    const existingUser = await Seller.find({userName: userName})
    if(existingUser.length !== 0){
        res
        .status(400)
        .json({"error": "user already exists"})
        return
    }
    const pwHashed = await bcrypt.hash(password,10)
    const newSeller =  new Seller({
        userName,
        passwordHash: pwHashed,
        Name,
        Items: []
    })
    const savedSeller = await newSeller.save()

    res.status(201).json(savedSeller)

})

SellerRouter.post('/login',async (req,res,next) => {
    const { userName, password } = req.body
    if (userName === undefined || password === undefined) {
        res.status(401).json({ "error": "invalid login" })
        return
    }
    const seller = await Seller.findOne({ userName })
    if (seller === null) {
        res.status(401).json({ "error": "invalid login" })
        return
    }
    const checkpassword = await bcrypt.compare(password, seller.passwordHash)
    if (checkpassword === false) {
        res.status(401).json({ "error": "invalid login" })
        return
    }
    const tosendtoken = {
        userName: seller.userName,
        Name: seller.Name,
        id: seller._id,
        type: 'seller'
    }

    const token = jwt.sign(tosendtoken,config.Salt)

    return res.status(200).json({...tosendtoken,token})
})

SellerRouter.get('/',async (req,res,next) => {
    return res.status(200).json(await Seller.find({}).populate('Items'))
})
module.exports = SellerRouter