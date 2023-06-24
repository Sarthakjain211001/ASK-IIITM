const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const askiiitmEmail = process.env.askiiitm_email
const askiiitmPass = process.env.emailPassword

var transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
        user: "askiiitm@gmail.com",
        pass:"sarthak_1234@askiiitm#"        
    }
});

module.exports = {

    sendEmail: async(req, res, next) => {
        var mailOptions = {
            from: "QnA_IIITM",
            to: req.mail.to,
            subject: req.mail.sub,
            text: req.mail.txt
        };
        await transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                return res.json({ error: "Mail not sent" })
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({ success: "Mail sent successfully" });
            }
        });
    }
}
