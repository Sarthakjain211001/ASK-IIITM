const User = require('../models/User');

const checkIfAllowed = async (req, res, next)=>{
    try{
        const u_id = req.user.id;
        if(u_id){
           const user = await User.findById(u_id);
           if(!user){
            return res.json({msg : "User not found", type : "error"})
           }
           else{
            if(user.iiitmStudent == true){
              next();
            }
            else{
                return res.json({msg : "Not allowed!! (Only iiitm stidents can give answers)", type : "error"})
            }
           }
        }
        else{
            console.log("User id not present");
            return res.json({msg : "User not present in request", type : "error"})
        }
    }catch(err){
        console.log("error: ", err);
        return res.json({msg : "Some error occured", type : "error"})
    }
}

module.exports = checkIfAllowed;