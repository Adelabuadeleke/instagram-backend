import mongoose from "mongoose";

const instance = mongoose.Schema({
    caption:String,
    user: String,
    Image:String,
    comments: [],
});

export default mongoose.model('posts', instance);