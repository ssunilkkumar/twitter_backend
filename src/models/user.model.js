const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minLength: 4},
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    image: {type: String, required: false},
    location: {type: String, required: false},
    joined: {type: String, required: false},
    bgimage: {type: String, required: false},
    followers: {type: [{type: mongoose.Schema.Types.ObjectId, ref: "user", required: true}]},
    follows :  {type: [{type: mongoose.Schema.Types.ObjectId, ref: "user", required: true}]}
}, {
    versionKey: false,
    timestamps: true
})

userSchema.pre("save", function(next) {
    if(!this.isModified("password")) return next();

    bcrypt.hash(this.password, 8, (err, hash) => {
        if(err) return next(err);

        this.password = hash;
        next();
    })
})

userSchema.methods.checkPassword = function (pass) {
    const passwordHash = this.password
    //console.log("check pass :", pass)

    return new Promise ((resolve, reject) => {
        bcrypt.compare(pass, passwordHash, (err, same) => {
            //console.log(err, same);
            if(err) return reject(err);

            resolve(same)
        })
    })
}

const User = mongoose.model("user", userSchema);

module.exports = User;