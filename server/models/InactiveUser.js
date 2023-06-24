const mongoose = require("mongoose");
const {Schema} = mongoose;

const InactiveUserSchema = new Schema({
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
    password: {
        type: String,
        required: true
    }, 
    expiresAt:{
        type : Date, 
    }
}, 
{timestamps : true}  
)

module.exports = mongoose.model("inactiveUser", InactiveUserSchema)
