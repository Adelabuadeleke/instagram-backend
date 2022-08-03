import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Pusher from "pusher";
import dbModel from "./dbModel.js";

// app config
const app = express();
const port = process.env.PORT || 8080;

// const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1457769",
  key: "fc7b5de220f31988e90e",
  secret: "56e04e5f6ddf6407b467",
  cluster: "eu",
  useTLS: true
});

// pusher.trigger("my-channel", "my-event", {
//   message: "hello world"
// });

// middlewares
app.use(express.json())
app.use(cors())

// DB config
const uri = "mongodb://localhost:27017/instagram-api"
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', ()=>{
    console.log('DB Connected');
    const changeStream = mongoose.connection.collection('posts').watch()
    changeStream.on('change', (change) => {
        console.log('Chage Triggered on pusher...');
        console.log(change);
        console.log('End of Change');

        if(change.operationType === 'insert') {
            console.log('Triggering Pusher ***IMG UPLOAD***')
            const postDetails = change.fullDocument;
            pusher.trigger('posts', 'inserted', {
                user: postDetails.user,
                caption: postDetails.caption,
                image: postDetails.image
            })
        } else {
            console.log('Unknown trigger from Pusher')
        }
    })
})

// api routes
app.get('/', (req, res) => { res.status(200).send("hello world")});

app.post('/upload', (req, res)=>{
    const body = req.body;
    dbModel.create(body, (err, data) => {
        if(err) {
            return res.status(500).send(err)
        } else {
            return res.status(201).send(data);
        }
    });
});

app.get('/sync', (req, res) => {
    dbModel.find((err, data) => {
        if(err) {
            return res.status(500).send(err)
        } else {
            return res.status(200).send(data);
        }
    })
})
// listen
app.listen(port, ()=>  console.log(`listening on localhost:${port}`));