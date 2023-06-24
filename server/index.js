const express = require("express")
const app = express();
const PORT  = process.env.PORT || 8000;
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/question');
const answerRoutes = require('./routes/answer');
const cookieParser = require('cookie-parser');
const cors = require('cors');
dotenv.config();
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("DB Connection Successfull!"))
.catch((err)=>{
    console.log(err);
});

// app.use(cors());
app.use(express.json());
app.use(cookieParser());
// app.use(express.cookieParser());

app.use((req, res, next) => {
    // res.setHeader("Access-Control-Allow-Origin", "https://kind-bell-f2c270.netlify.app");

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );

    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });
  

// app.use(express.json())


app.use("/api/auth", authRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answer", answerRoutes)
const server = app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`);
})

