const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const dotenv = require("dotenv");
const verifyToken = require('../middleware/VerifyToken');
const checkIfAllowed = require('../middleware/checkIfAllowed');
const { postAnswer, getAnsForAQues, getAnsOfAUser } = require('../controllers/answer-controller');
const { reportOnAnswer, unreportAnAnswer } = require('../controllers/report-controller');

dotenv.config();

router.post('/post/:qid', verifyToken, checkIfAllowed, [
    body('desc', 'Description must be at least 5 charachters').isLength({min : 5}),
], postAnswer);
router.get('/getAns/:qid', verifyToken, getAnsForAQues);
router.get('/getUserAns', verifyToken, getAnsOfAUser);
router.put('/report/:ansId', verifyToken, reportOnAnswer);
router.put('/unreport/:ansId', verifyToken, unreportAnAnswer);
module.exports = router;