const Answer = require("../models/Answer");
const { validationResult } = require('express-validator');
const User = require("../models/User");

module.exports = {
    postAnswer : async(req, res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.json({msg : errors.array(), type : "error"})
        }
        console.log("express validation done");
        try{
        const user_id = req.user.id;
        const ques = req.params.qid;
        console.log("u_id: ", user_id);

        if(!user_id){
         return res.json({msg : "User not present in request", type :"error"});
        }
        
        if(!ques){
         return res.json({msg : "Question not present in request", type :"error"});  
        }
        const {desc, img} = req.body;
        
        const ans = new Answer({
            question: ques,
            desc : desc,
            img : img,
            author : user_id,
            reports : 0
        });
       console.log("ans: ", ans);
        const A = await ans.save();
        console.log("A from 35: ", A)
        // return res.json({msg : Q, type :"success"});
        return res.json({msg : "posted successfully", type :"success", ans:A});
      }catch(err){
          console.log("error: ", err);
         return res.json({msg : "Some error occured", type : "error"})
      }
    },

    getAnsForAQues : async(req, res, next)=>{
        try{
        const quesId = req.params.qid;
        const answers = await Answer.find({question : quesId}).populate('question').populate('author');
        return res.json(answers);
        }catch(err){
            console.log("error: ", err);
            return res.json({msg : "Some error occured", type : "error"})
        }
    },

    getAnsOfAUser : async(req,res,next)=>{
    try{
        const userId = req.user.id;
        const answers = await Answer.find({author : userId}).populate('author').populate('question');
        return res.json(answers);
    }catch(err){
        return res.json({msg : err, type: "error"})
    }
    }
}