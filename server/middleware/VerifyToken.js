const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();

const Jwt_sec = process.env.JWT_SECRET

const verifyToken = (req, res, next)=>{
    
    console.log("cookies from verifyToken: ", req.cookies);
    if(req.cookies.authToken){
    const token = req.cookies.authToken;   //we will store the auth token in cookies when the user log in . 
                                           //So here we are accessing the cookies using req.cookies.authToken
    
    if(!token){
        return res.json({error : "token not available"});
    }
    try{
       console.log("token from verifyToken : ", token);
       const data = jwt.verify(token, Jwt_sec);
       req.user = data.user;
       console.log("Data:" , data);
       next();
    }catch(err){
        return res.json({error : "Some error occured"});
    }
    }else{
        return res.json({error : "Token not available"});
    }
}


module.exports = verifyToken;