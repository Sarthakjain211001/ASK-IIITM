const mongoose = require("mongoose");
const {Schema} = mongoose;
// const profImg = require('../Images/prof-modified.png')

const UserSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        unique : true
    },
    profImg : {
        type : String,
        default : 'https://www.pikpng.com/pngl/m/80-805068_my-profile-icon-blank-profile-picture-circle-clipart.png'
    },
    password: {
        type: String,
        required: true
    },
    iiitmStudent:{
        type: Boolean,
        default: false,
    },
    reportedOn:[{
            type: Schema.Types.ObjectId,
            ref : 'answer',
    }],
    batch:{
        type: String,
        default : ""
    },
    starredQues : [{
            type : Schema.Types.ObjectId,
            ref  : 'question'
    }]
}, 
{timestamps : true}  
)

module.exports = mongoose.model("user", UserSchema)
