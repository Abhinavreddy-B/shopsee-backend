const express = require('express')
const User = require('../models/users')
const middleware = require('../utils/middleware')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const UserRouter = express.Router()

UserRouter.post('/signup', async (req, res, next) => {
    const { userName, password, Name } = req.body
    if (userName === undefined || password === undefined) {
        res
            .status(400)
            .json({ "error": "Both username and password required" })
        return
    }
    const existingUser = await User.find({ userName: userName })
    if (existingUser.length !== 0) {
        res
            .status(400)
            .json({ "error": "user already exists" })
        return
    }
    const pwHashed = await bcrypt.hash(password, 10)
    const newUser = new User({
        userName,
        passwordHash: pwHashed,
        Name,
        Cart: [],
    })
    const savedUser = await newUser.save()

    res.status(201).json(savedUser)

})

UserRouter.post('/login', async (req, res, next) => {
    const { userName, password } = req.body
    if (userName === undefined || password === undefined) {
        res.status(401).json({ "error": "invalid login" })
        return
    }
    const user = await User.findOne({ userName })
    if (user === null) {
        res.status(401).json({ "error": "invalid login" })
        return
    }
    const checkpassword = await bcrypt.compare(password, user.passwordHash)
    if (checkpassword === false) {
        res.status(401).json({ "error": "invalid login" })
        return
    }
    const tosendtoken = {
        userName: user.userName,
        Name: user.Name,
        id: user._id,
        type: 'user'
    }

    const token = jwt.sign(tosendtoken, config.Salt)

    return res.status(200).json({ ...tosendtoken, token })
})

UserRouter.post('/cart', middleware.tokenExtractor, middleware.userExtractor, async (req, res, next) => {
    const itemId = req.body.id
    const user = req.user

    if (user.Cart) {
        const index = user.Cart.findIndex(item => item.id === itemId)
        if(index === -1){
            user.Cart.push({
                item: itemId,
                quantity: 1
            })
        }else{
            user.Cart[index].quantity+=1
        }
    } else {
        user.Cart = [{
            item: itemId,
            quantity: 1
        }]
    }
    try {
        await user.save()
        return res.status(200).json({ 'status': 'success' })
    } catch (e) {
        console.log(e)
        return res.status(500)
    }
})

UserRouter.get('/cart', middleware.tokenExtractor, middleware.userExtractor, async (req, res, next) => {
    const cart = req.params.id
    const userid = req.user._id

    const userData = await User.findById(userid).populate({
        path: 'Cart',
        populate: {
            path: 'item',
            model: 'Item',
            populate: {
                path: 'seller',
                model: 'Seller'
            }
        }
    })
    
    console.log(userData)
    return res.status(200).json(userData.Cart)
})

UserRouter.get('/', async (req, res, next) => {
    return res.status(200).json(await User.find({}))
})

module.exports = UserRouter 