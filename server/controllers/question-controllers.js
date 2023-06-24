const Question = require("../models/Question");
const { validationResult } = require('express-validator');
const User = require("../models/User");

module.exports = {
    askQuestion : async(req, res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.json({msg : errors.array(), type : "error"})
        }
        console.log("express validation done");
        try{
        const user_id = req.user.id;
        console.log("u_id: ", user_id);
        const {title, desc, img, tags} = req.body;
        
        let tagsArr = null;
        if(tags){
        const myArr = tags.split(",");
        tagsArr = myArr.map(element => {return element.trim()});
        }
        
        const ques = new Question({
            title : title,
            desc : desc,
            img : img,
            tags : tagsArr,
            author : user_id
        });
       console.log("ques: ", ques);
        const Q = await ques.save();
        // return res.json({msg : Q, type :"success"});
        return res.json({msg : "posted successfully", type :"success", que:Q});
      }catch(err){
          console.log("error: ", err);
         return res.json({msg : "Some error occured", type : "error"})
      }
    },

    getAllQuestions : async(req, res, next)=>{         
        try{
         const questions = await Question.find().populate('author');
         questions.sort(function(a,b){return (a.createdAt - b.createdAt)});
         return res.json(questions);
        }catch(err){
            return res.json({msg : err, type: "error"})
        }
         
    },

    getQuesById : async(req, res, next)=>{
        try{
            const Id = req.params.id;
            const questions = await Question.findById(Id).populate('author');
            return res.json(questions);
        }catch(err){
            return res.json({msg : err, type: "error"})
        }
    },

    getQuesByUserId : async(req, res, next)=>{
        try{
            const userId = req.user.id;
            const questions = await Question.find({author : userId}).populate('author');
            return res.json(questions);
        }catch(err){
            return res.json({msg : err, type: "error"})
        }
    },

    getStarredQues : async(req, res,next) => {
        try{
            const userId = req.user.id;
            const starredQues = await User.findById(userId).populate('starredQues');
            return res.json(starredQues);
        }catch(err){
            return res.json({msg : err, type: "error"})
        }
    },

    starAQues : async(req, res,next) => {
        try{
            console.log("Inside starAQues")
            const QuesId = req.params.id;
            console.log("qId: ", QuesId);
            const userId = req.user.id;
            console.log("uId: ", userId);
            // const AllstarredQues = await User.findByIdAndUpdate(userId, {
            //     starredQues : [...starredQues , QuesId]        //
            // })
            const oldUser = await User.findById(userId);
            if(oldUser.starredQues.includes(QuesId)){
                return res.json({msg : "Already starred", type: "error"});
            }

            const data = await User.findByIdAndUpdate(userId, 
                { "$push": { "starredQues": QuesId } },   //push the question with id = QuesId
                                                          //in the starredQues array.
                { "new": true, "upsert": true }           
            )
            
            console.log("starredQues: ", data.starredQues);
            return res.status(200).json(data.starredQues);
        }catch(err){
            return res.json({msg : err, type: "error"})
        }
    },

    UnstarAQues : async(req, res,next) => {
        try{
            console.log("Inside starAQues")
            const QuesId = req.params.id;
            console.log("qId: ", QuesId);
            const userId = req.user.id;
            console.log("uId: ", userId);
            
            const oldUser = await User.findById(userId);
            if(oldUser.starredQues.includes(QuesId)){
                const data = await User.findByIdAndUpdate(userId, 
                    { $pull: { 'starredQues': QuesId } },   //for removing the question with 
                                                            //id = QuesId from the starredQues array. 
                ) 
                console.log("starredQues: ", data.starredQues);
            return res.json(data.starredQues);
            }
            else{
                return res.json({msg : "Question not starred", type: "error"})    
            }
            
            
        }catch(err){
            return res.json({msg : err, type: "error"})
        }
    },
}