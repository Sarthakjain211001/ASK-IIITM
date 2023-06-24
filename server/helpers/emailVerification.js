const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();

const Jwt_sec = process.env.JWT_SECRET

const emailVer = (token)=>{
    
    if(!token){
        return ({error : "Token not available"});
    }
    try{
        console.log("token :", token);
        console.log("Inside try");
       const data = jwt.verify(token, Jwt_sec);
       console.log(data);
       return({user : data.user});
    }catch(err){
        return({error : "Verification failed"});
    }
}
module.exports = emailVer;