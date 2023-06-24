const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const dotenv = require("dotenv");
const verifyToken = require('../middleware/VerifyToken');
const { askQuestion, getAllQuestions, getQuesById, getQuesByUserId, starAQues, UnstarAQues } = require('../controllers/question-controllers');
dotenv.config();

router.post('/ask', verifyToken, [
    body('title', 'Title must be at least 3 charachters').isLength({min : 3}),
], askQuestion);
router.get('/getAll', verifyToken, getAllQuestions);
router.get('/get/:id', verifyToken, getQuesById);
router.get('/getByUserId', verifyToken, getQuesByUserId);
// router.get('/getStarredQues/:id', verifyToken, getStarredQues);
router.put('/star/:id', verifyToken, starAQues);
router.put('/unstar/:id', verifyToken, UnstarAQues);
module.exports = router;