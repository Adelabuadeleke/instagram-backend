import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Pusher from "pusher";

// app config
const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(express.json())
app.use(cors())

// DB config
const uri = "mongodb://localhost:27017/poddin-api"
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', ()=>{
    console.log('DB Connected')
})

// api routes
app.get('/', (req, res) => { res.status(200).send("hello world")});

// listen
app.listen(port, ()=>  console.log(`listening on localhost:${port}`));