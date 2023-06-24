const mongoose = require("mongoose");
const {Schema} = mongoose;

const QuestionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        default: null
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
    tags: [{
        type: String,
    }]
}, 
{timestamps : true}  
)

module.exports = mongoose.model("question", QuestionSchema)
