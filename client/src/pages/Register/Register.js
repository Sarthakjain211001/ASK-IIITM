import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { getUserCall, RegisterCall } from '../../ApiCalls'
import './Register.css'

const Register = ({currUser, setCurrUser}) => {

  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  useEffect( () => {
      
    let res = null;
    async function fetch(){
      document.getElementById("SignupBtn").disabled=true;
      res = await getUserCall();
      if(res){
        if(res.data.User)
         {
           console.log("Line 93: " , res.data.User)
            setCurrUser(res.data.User);
            document.getElementById("SignupBtn").disabled=false;
         }     
        else{
            setCurrUser(null);
            document.getElementById("SignupBtn").disabled=false;
            // window.alert(res.data.txt)
        }
      }
      else{
        setCurrUser(null);
        document.getElementById("SignupBtn").disabled=false;
      }
    }
   
    fetch();
  }, []);
  
  const handleClick = async (e)=>{
      e.preventDefault();    
      document.getElementById("SignupBtn").disabled=true;

      const data={
          username: username,
          email:email,
          password:password
      } 

      const res1 = await RegisterCall(data);    //Api call for login. Imported from apiCalls.js file 
      console.log("res1:" , res1);
      if(res1.data.error){
        let err= res1.data.error;
        window.alert(err);
      }

      const res2 = await getUserCall();
      console.log("res2: ", res2)
      document.getElementById("SignupBtn").disabled=false;
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
<h2 className="text-center"><strong>Create</strong> an account.</h2>
<div className="form-group"><input className="form-control" type="text" name="username" placeholder="Username" minLength={3} onChange={(e)=> setusername(e.target.value)} required/></div>
<div className="form-group"><input className="form-control" type="email" name="email" placeholder="Email"  onChange={(e)=> setemail(e.target.value)} required/></div>
<div className="form-group"><input className="form-control" type="password" name="password" placeholder="Password" minLength={5}  onChange={(e)=> setpassword(e.target.value)} required/></div>
<div className="form-group">
</div>
<div className="form-group"><button id="SignupBtn" className="btn btn-success btn-block" type="submit" onClick={handleClick}>Sign Up</button></div>
<a className="already">Already have an account?<Link to="/login"> Login here.</Link></a>
</form>
</div>
</div> 
  )
}

export default Register