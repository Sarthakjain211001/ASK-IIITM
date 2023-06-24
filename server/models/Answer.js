const mongoose = require("mongoose");
const {Schema} = mongoose;

const AnswerSchema = new Schema({
    question :{
        type: Schema.Types.ObjectId,
        ref: 'question',
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: null
    },
    author: {
        type: Schema.Types.ObjectId,
        ref : 'user',
        required: true
    },
    reports: {
        type: Number,
        default: 0
    }
}, 
{timestamps : true}  
)

module.exports = mongoose.model("answer", AnswerSchema)

