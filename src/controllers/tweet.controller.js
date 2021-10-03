const express = require ("express");
const router = express.Router();

const Tweet = require ("../models/tweet.model")

const protect = require ("../middlewares/protect");
const authorize = require("../middlewares/authorize");

router.get("/", async (req, res) => {
    const tweets = await Tweet.find().populate("user").lean().exec();

    return res.status(200).json({data: tweets})
})

router.post("/", async (req, res) => {
    const tweet = await Tweet.create(req.body);

    return res.status(201).json({data: tweet})
})

router.patch("/:id", protect, async (req, res) => {
    try{
        const tweet = await Tweet.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(400).json({tweet})
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.delete("/:id", protect, async (req, res) => {
    try {
        const tweet = await Tweet.findByIdAndDelete(req.params.id)
        res.status(400).json({tweet})
    } catch (err) {
        res.status(400).json({message: err.message})

    }
})

module.exports = router