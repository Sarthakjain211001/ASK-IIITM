import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserCall, LoginCall } from '../../ApiCalls'

const spinnerImg= require('../../components/spinnerImg.gif')

const Login = ({currUser, setCurrUser}) => {

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    useEffect( () => {
        
      let res = null;
      async function fetch(){
        document.getElementById("loginBtn").disabled=true;
        res = await getUserCall();
        console.log("Line 88: ", res);
        if(res){
          if(res.data.User)
           {
              console.log("Line 93: " , res.data.User)
              document.getElementById("loginBtn").disabled=false;
              setCurrUser(res.data.User);
           }     
          else{
            document.getElementById("loginBtn").disabled=false;  
            setCurrUser(null);
          }
        }
        else{
          document.getElementById("loginBtn").disabled=false;
          setCurrUser(null);
        }
      }
     
      fetch();
    }, []);
    
    const handleClick = async (e)=>{
        e.preventDefault();    
        document.getElementById("loginBtn").disabled=true;

        const data={
            email:email,
            password:password
        } 

        const res1 = await LoginCall(data);    //Api call for login. Imported from apiCalls.js file 
        console.log("res1:" , res1);
        if(res1.data.error){
          let err= res1.data.error;
          window.alert(err);
        }

        const res2 = await getUserCall();
        console.log("res2: ", res2)
        document.getElementById("loginBtn").disabled=false;
        if(res2.data.User)
         {
             setCurrUser(res2.data.User);
         }     
        else{
            setCurrUser(null);
        }
      }
      
  return (
<div className="register-photo">
<div className="form-container">
<div className="image-holder"></div>
<form method="post" className='form'>
<h5 className="text-center">Q&A_IIITM</h5>
<h2 className="text-center">
  <strong>Login</strong> to your account.
</h2>
<div className="form-group">
  <input className="form-control" type="email" name="email" placeholder="Email" onChange={(e)=> setemail(e.target.value)} required/>
</div>
<div className="form-group">
  <input className="form-control" type="password" minLength={5} name="password" placeholder="Password" onChange={(e)=> setpassword(e.target.value)} required/>
</div>
<div className="form-group">
</div>

<div className="form-group">
  <button id="loginBtn" className="btn btn-success btn-block" onClick={handleClick} /*type="submit"*/ >Log In</button>
</div>
<a className="already">Don't have an account?<Link to="/register">Signup here.</Link></a>
</form>
{/* <span id="err">Something went wrong !!</span>
<div id="loader">
  <img src={spinnerImg} alt="loader" ></img>
</div> */}
</div>
</div> 
  )
}

export default Login