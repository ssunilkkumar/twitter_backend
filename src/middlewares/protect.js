const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
            if(err) return reject (err);

            return resolve(payload);
        });
    });
};

const protect = async (req, res, next) => {
    //first we need to get token from the
    const bearer = req.headers.authorization;
    console.log(req.headers);

    if(!bearer || !bearer.startsWith("Bearer "))
        return res.status(401).json({
            status: "failed",
            message: "Your email or password is not correct",
    })
    //we need to verify token
    const token  = bearer.split("Bearer ")[1].trim();

    //retrieve the user and if user exist then good else bad token
    let payload ;
    try {
      payload = await verifyToken(token);
    } catch (err) {
         return res.status(401).json({
            status: "failed",
            message: "Your email or password is not correct token",
        })
    }

    let user;
    try {
        //console.log("payload :", payload.id)
        user = await User.findById(payload.id).lean().exec();
        //console.log(user)

    } 
    catch (e) {
        return res
            .status(500).json({
                status: "failed",
                message: "Something went wrong line 47"
            })
    }

    if(!user) {
        return res.status(401).json({
            status: "failed",
            message: "Your user not found",
        })
    }

    req.user = user;
    next();
};

module.exports = protect;