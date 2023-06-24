const express = require('express');
const router = express.Router();
const User = require('../models/User');
const InactiveUser = require('../models/InactiveUser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser')
const dotenv = require("dotenv");
// const verifyToken = require('../middleware/verifyToken');
const { sendEmail } = require('../helpers/email_service');
const emailVer = require('../helpers/emailVerification');
const verifyToken = require('../middleware/VerifyToken');
dotenv.config();

const Jwt_sec = process.env.JWT_SECRET;

//REGISTER :

router.post('/register', [
    body('username', 'Enter a valid username').isLength({min : 3}),
    body('email', 'Enter a valid email').isEmail(),    
    body('password', 'Password must contain atleast 5 characters').isLength({min: 5}),
], 
async(req, res, next)=>{
    console.log("express validation start");
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({text : errors.array(), type : "err"})
    }
    console.log("express validation success");
    const{username, email, password} = req.body;
    console.log(username, email, password);
    try{
        let findUserbyemail = await User.findOne({ email: email });               //finding from active users
        let findUserbyusername = await User.findOne({ username : username });     //finding from active users
        if(findUserbyemail){
            return res.json({text : "User already exists", type : "err"});
        }
        else{
            console.log("No finduserbyEmail");
        }
        if(findUserbyusername){
            return res.json({text : "Username already in use. Choose a different username", type : "msg"});
        }
        else{
            console.log("No finduserbyusername");
        }
        
        let findInactiveUserbyEmail = await InactiveUser.findOne({ email : email });
        let findInactiveUserbyUsername = await InactiveUser.findOne({ username : username });
        
        if(findInactiveUserbyEmail && findInactiveUserbyEmail.expiresAt > Date.now()){     //If an inactive user with the same email is present but has not expired
           return res.json({text : "A verification mail has been sent already", type : "msg"})
        }
        else{
            console.log("Inactive email no");
        }
        if(findInactiveUserbyUsername && findInactiveUserbyUsername.expiresAt > Date.now()){  //If an inactive user with the same username is present but has not expired
            return res.json({text : "Username already in use. Choose a different username", type : "msg"})
        }
        else{
            console.log("Inactive username no");
        }
        console.log("Finding complete");
        if(findInactiveUserbyEmail)  {const deleteUser1 = await InactiveUser.findByIdAndDelete(findInactiveUserbyEmail._id);}   //deleting exisitng inactive user
        if(findInactiveUserbyUsername) {const deleteUser2 = await InactiveUser.findByIdAndDelete(findInactiveUserbyUsername._id);}   //deleting exisitng inactive user
        console.log("Delete complete");

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);
        const inact_user = await InactiveUser.create({   //creating new inactive user
                    username : username,
                    email : email,
                    password : secPass,
                    expiresAt : Date.now() + 600000
        })
        console.log("added in db");
        const data = {
            user:{
                id: inact_user._id
            }
        }   
        console.log("data: ", data);
        console.log(Jwt_sec);
        const authToken = jwt.sign(data, Jwt_sec, {expiresIn:"600s"});   //Will expire after 10 min
        console.log("authToken: ", authToken);
        let verificationLink = `http://localhost:8000/api/auth/verification/${authToken}`;
        let mail = {
            to : inact_user.email,
            sub : "Email verification for Q&A-IIITM",
            txt : `Hi ${inact_user.username}. Click on the following link to activate your Q&A-IIITM account. 
                   Link : ${verificationLink}`
        }
        req.mail = mail;
        next();
    }catch(err){
        return res.json({text : "Some error occured", type : "msg"});
    }
}, sendEmail)

// Verifying the Token
router.get('/verification/:token', async(req, res, next)=>{
  try{
  const token = req.params.token;
  const result = emailVer(token);
  console.log(result);
  if(result.user){
  const inactUserId = result.user.id;
  const inactUser = await InactiveUser.findById(inactUserId);
  const{username, email, password} = inactUser;
  const activeUser = new User({
      username : username,
      email : email,
      password : password
  })
  if(email.slice(-12) === "@iiitm.ac.in"){
      activeUser.iiitmStudent = true;
      activeUser.batch = email.slice(0,8)
  }
  const newData = await activeUser.save();
  console.log("newData: ", newData);
  const DelinactUser = await InactiveUser.findByIdAndDelete(inactUserId);
  const data = {
    user:{
        id: newData._id
    }
   }   

  const authToken = jwt.sign(data, Jwt_sec, {expiresIn:"3d"});   //Will expire after 10 min
  console.log("authtoken from verification: ", authToken);
  res.cookie('authToken', authToken, {
             maxAge: 259200000, 
             httpOnly: true,
             sameSite: "none",
            //  secure : true
          });
  return res.json({text : "Successfull registration", type : "success"})
}else{
    let text = "Some error occured";
    if(result.error){
      text = result.error;
    }
    return res.json({text : text , type : "err"})
}
}catch(err){
    return res.json({text : "Some error occured", type : "err"});
}
})
    

//LOGIN: 
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must contain atleast 5 characters').isLength({min: 5})
], 
async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({txt: errors.array(), type : "err"})
    }
    const {email, password} = req.body;
    
    try{
        let user = await User.findOne({email : email})
        if(!user){
          return res.json({txt : "User does not exists", type :"err"})
        }
        
        const passwordCompare = await bcrypt.compare(password, user.password)

        if (!passwordCompare) {                              
            return res.json({text : "Wrong Credentials", type :"err" });
       }
        
       const data = {
            user: {
                 id: user.id
            }
       }
       const authToken = jwt.sign(data, Jwt_sec, {expiresIn:"3d"});  
       console.log("authToken: ", authToken);
    //    res.clearCookie('authToken', {sameSite: "none"/*, secure : true*/});
       res.cookie('authToken', authToken, {
           maxAge: 259200000,
            httpOnly: true,
            sameSite: "none",
            // secure : true 
        });
       return res.status(200).json({authToken : authToken});
    }catch(err){
        res.json({error : err});
    }
    
}
)

//GET USER: 
router.get("/getUser", verifyToken ,async(req, res)=>{
  const userId= req.user.id;
  console.log(req.cookies); 
  try{
      const getUser = await User.findById(userId).populate('starredQues');
      if(getUser){
          return res.status(200).json({User : getUser});
      }
      else{
        return res.json({error : "User not found"});    
      }
  }catch(err){
      return res.json({error : "Some error occured"});
  }

})

//UPDATE PROFILE PIC :
router.put("/updateProfImg", verifyToken, async(req,res)=>{
    try{
        const img = req.body.profImg;
        const userId= req.user.id;
        if(img && img!=""){
          const result = await User.findByIdAndUpdate(userId, {profImg:img}, 
            { "new": true, "upsert": true })

          return res.json({msg : result , type : "Success"})  
        }
        else{
            return res.json({msg : "No image found"});
        }
    }catch(err){
        return res.json({error : "Some error occured"});
    }
})


//LOGOUT : 
router.get("/logout", async(req,res)=>{
    try{
    res.clearCookie('authToken', {sameSite: "none", httpOnly:true /*secure : true*/});
     return res.status(200).json("Logout success")
    }catch(err){
     return res.json({error : "Some error occured"})
}
})

 module.exports = router

