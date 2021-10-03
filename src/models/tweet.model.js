const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    tweet: {type: String, required: true},
    img: {type: String, required: false},
    video: {type: String, required: false},
    retweet: {type: [{type: mongoose.Schema.Types.ObjectId, ref: "user", required: false}]},
    like : {type: [{type: mongoose.Schema.Types.ObjectId, ref: "user", required: false}]},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true}
}, {
    versionKey: false,
    timestamps: true
})

const Tweet = mongoose.model("tweet", tweetSchema);

module.exports = Tweet;