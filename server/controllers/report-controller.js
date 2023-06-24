const Answer = require("../models/Answer");
const { validationResult } = require('express-validator');
const User = require("../models/User");

module.exports = {
    reportOnAnswer : async(req, res,next)=>{
        try{
        const userId = req.user.id;
        const ansId = req.params.ansId;

        const user = await User.findById(userId);
        const reportsByUser = user.reportedOn;
        if(reportsByUser.includes(ansId))
          return res.json({msg : "Already reported", type : "error"})

        const data = await User.findByIdAndUpdate(userId, 
            { "$push": { "reportedOn": ansId } },   //push the question with id = QuesId
                                                          //in the reportedOn array.
                { "new": true, "upsert": true }          //
        )
       
        const Reports = await Answer.updateOne(
            {"_id" : ansId}, 
            { $inc : {reports : 1}} 
        )
        console.log(data.reportedOn, Reports);
        return res.json({reportedAns : data.reportedOn, reports : Reports, type:"Success" })

        }catch(err){
            console.log("error: ", err);
            return res.json({msg : "Some error occured", type : "error"})
        }
    },

    unreportAnAnswer : async(req, res, next)=>{
        try{
            const userId = req.user.id;    
            const ansId = req.params.ansId;
    
            const user = await User.findById(userId);
            const reportsByUser = user.reportedOn;
            if(!reportsByUser.includes(ansId))
              return res.json({msg : "Not reported before", type : "error"})
    
            const data = await User.findByIdAndUpdate(userId, 
                { "$pull": { "reportedOn": ansId } }   //push the question with id = QuesId
                                                              //in the reportedOn array.
            )
           
            const Reports = await Answer.updateOne(
                {"_id" : ansId}, 
                { $inc : {reports : -1}} 
            )
            console.log(data.reportedOn, Reports);
            return res.json({reportedAns : data.reportedOn, reports : Reports, type:"Success" })
    
            }catch(err){
                console.log("error: ", err);
                return res.json({msg : "Some error occured", type : "error"})
            }
    }
}
