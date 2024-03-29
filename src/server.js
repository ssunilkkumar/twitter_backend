const express = require("express");
require("dotenv").config()

const connect = require("./config/db");

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const  {signup, signin, user } = require("./controllers/auth.controller")
const tweetController = require("./controllers/tweet.controller")

app.post("/signup", signup);
app.post("/signin", signin);
app.get("/users", user)

app.get("/", async (req, res) => {
    res.send('Welcome to backend!');
})

app.use("/tweets", tweetController)

const start = async () => {
    await connect();

    app.listen(port, () => {
        console.log(`Listening on port ${port}...`)
    })
}


module.exports = start;