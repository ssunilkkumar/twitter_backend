const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('../models/user.model')

const newToken = (user) => {
    return jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY);
}

const signup = async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.create(req.body)
        let token = newToken(user)
        return res.status(201).json({data: {token}})
    }
    catch (err) {
        return res 
            .status(500)
            .json({status: "failed", meaasage: "something went wrong"})
    }
}

const signin = async (req, res) => {
    // we will find the user with the email adrress
    let user;
    try{
        user = await User.findOne({email: req.body.email}).exec()
        if(!user) 
            return res
                .status(401)
                .json({
                    status: "failed",
                    message: "Your email is not correct",
                })
    } catch (e) {
        return res
            .status(500)
            .json({
                status: "failed",
                message: "Something went wrong here in email"
            })
    }

    // we will try to match the password the user has with th epassword stored in the system
    try {
        const match = await user.checkPassword(req.body.password)
        //console.log("match: ", match)
        if(!match) return res
            .status(401)
            .json({
                status: "failed",
                message: "Your password is not correct",
            })
    } catch (e) {
        return res
            .status(500)
            .json({
                status: "failed",
                message: "Something went wrong in password"
            })
    }

    // create a new token and return it
    const token  = newToken(user);

    return res.status(201).json({data: {token}});
}


// get users
const user = async (req, res) => {
    console.log(req.body)
    const users = await User.find().select("-password").lean().exec();

    return res.status(200).json({data: users})
}

module.exports = {
    signup,
    signin,
    user,
    newToken
}