const User = require('../models/user.model')
const Post = require('../models/tweet.model')

const authorize = (PermittedRoles) => {
    //console.log("roles", PermittedRoles)
    return async (req, res, next) => {
        // If there were no permittedRoles or an empty array thn it means everyone can visit the endpoint.
        if(!PermittedRoles || PermittedRoles.length === 0) return next();
        //If it has some roles then we need to check if current user has those permittedRoles.
        const user = req.user
        //console.log("req user : ", user)

        const isUserPermitted = await User.findOne({
            _id: user._id,
            roles: {$in: PermittedRoles}
        }).exec()
        console.log("is permitted : ", isUserPermitted)
        const isUser = await Post.findOne({
            user: user._id
        })
        console.log("is user : ", isUser)
        //If current user does not have the permissions then return 403.
        if(!isUserPermitted && !isUser) return res.status(403).json({message: "you are not allowed to visit this page"});
 
        // if user is allowed the next()
        return next()
    }
}

module.exports = authorize;