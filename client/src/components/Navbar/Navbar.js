import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AskAQues, LogoutCall, updateProfPic } from '../../ApiCalls'
import './Navbar.css'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'
import firebaseApp from '../../firebase/config';


const Navbar = ({ Q1, setQ1, Ques, setQues, currUser, setCurrUser }) => {

  const [title, settitle] = useState(null);
  const [desc, setdesc] = useState(null);
  const [file, setFile] = useState(null);
  const [AllQues, setAllQues] = useState(null);
  const [error, setError] = useState(null);
  
  const [tags, settags] = useState(null);
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  const [img, setImg] = useState(null);
  const [url, setUrl] = useState(null);
  const [profurl, setprofUrl] = useState(null);
  const [prog, setProg] = useState(0);
  const [profProg, setprofProg] = useState(0);
  const [proffile, setprofFile] = useState(null);
  const [profError, setprofError] = useState(null);

  useEffect(()=>{
    console.log("Questions from line 29: ", Q1)
    console.log("Inside UE for setting All Ques");
    setAllQues(Q1);
  },[Q1])

  useEffect(() => {
    if(title){
      
    }
  }, [title])
  

  const ImgUpload = (type) => {
    console.log("inside img upload");
    const storage = getStorage(firebaseApp);
    const name = uuidv4()
    const storageRef = ref(storage, name);
    // if(type === "profile")
    //    const uploadTask = uploadBytesResumable(storageRef, proffile);
    // else    
    //    const uploadTask = uploadBytesResumable(storageRef, file);

       const uploadTask = (type === "profile") ? uploadBytesResumable(storageRef, proffile) : uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
      (snapshot) => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;   //percentage of the image uploaded
        console.log("Perc: ", percentage);
        
        if(type ==="profile"){ 
          console.log("setting prof perc in upload");
         setprofProg(percentage);
        }
        else {
          console.log("setting ques perc in upload");
         setProg(percentage);
        }
      },
      (error) => {
        console.log(error);
        if(type ==="profile") {
          console.log("setting prof error in upload");
         setprofError(error);}
        else {
          console.log("setting ques error in upload");
         setError(error);
        }
      },
      async () => {
        const Url = await getDownloadURL(uploadTask.snapshot.ref)    //get the downloadUrl from the reference of the uploaded image            
        if(type ==="profile"){
          console.log("setting prof url in upload");
         setprofUrl(Url);
        }
        else {
          console.log("setting ques url in upload");
         setUrl(Url);
        }
        console.log("inside img upload URL 42 : ", Url);
      }
    );
  }

  useEffect(() => {
    console.log("48 running use effect");
    if (file) {
      console.log("calling imgUpload inside use Effect");
      ImgUpload("question");
    }
  }, [file])

  useEffect(() => {
    console.log("72 running proffile use effect");
    if (proffile) {
      console.log("calling prof imgUpload inside use Effect");
      ImgUpload("profile");
    }
  }, [proffile])

  useEffect(() => {
    if (prog === 100)
      document.getElementById("progBar").style.display = "none"
  }, [prog])

  useEffect(() => {
    if (profProg=== 100)
      document.getElementById("profProgBar").style.display = "none"
  }, [profProg])

  const handleLogout = async (e) => {
    e.preventDefault();
    const res = await LogoutCall();
    if (res.status === 200)
      setCurrUser(null);
  }

  useEffect(() => {
    if (url) {
      console.log("got ques url in useEffect .... unblocking btn");
      // document.getElementById("prog").style.display = "none";
      document.getElementById("postBtn").disabled = false;
      setError("");
    }
  }, [url])

  useEffect(() => {
    if (profurl) {
      console.log("got prof url in useEffect .... unblocking btn");
      // document.getElementById("prog").style.display = "none";
      document.getElementById("profPostBtn").disabled = false;
      setprofError("");
    }
  }, [profurl])


  const changeHandler = async (e) => {
    console.log("Blocking prog and btn");
    // document.getElementById("prog").style.display = "block";
    document.getElementById("postBtn").disabled = true;
    let selected = e.target.files[0];   //some selectors allow us to choose multiple files. So files property returns an array. But here in our project we are imlpementing the selector which can choose only one file

    if (selected && allowedTypes.includes(selected.type)) {          //If selected is not null and it's type is included in allowedTypes array then olny setFile
      setFile(selected);
    }
  }
  const profChangeHandler = async (e) => {
    console.log("Blocking btn in profChHand");
    // document.getElementById("prog").style.display = "block";
    document.getElementById("profPostBtn").disabled = true;
    let selected = e.target.files[0];   //some selectors allow us to choose multiple files. So files property returns an array. But here in our project we are imlpementing the selector which can choose only one file
    console.log("selected 128: ",selected);
    if (selected && allowedTypes.includes(selected.type)) {          //If selected is not null and it's type is included in allowedTypes array then olny setFile
      setprofFile(selected);
    }
    console.log("setting done 132 : ");
  }
  const handlePost = async (e) => {
    e.preventDefault();
    const data = {
      title: title,
      desc: desc,
      img: url,
      tags: tags
    }
    const res = await AskAQues(data);
    if (res.data.type === "success") {
      document.getElementById("closeBtn").click();
      res.data.que.author = {
        username : currUser.username,
        profImg : currUser.profImg
      }
      setQues([...Ques, res.data.que])
    }

  }
  let profPic = null;

  const handleProfPost = async (e) => {
    console.log("inside prof post btn");
    e.preventDefault();
    const data = {
      profImg : profurl
    }
    const res = await updateProfPic(data);
    console.log(res);
    if (res.data.type === "Success") {
      profPic = res.data.msg.profImg;
      document.getElementById("navProfPic").src=profPic;
      document.getElementById("profcloseBtn").click();      
    }

  }

  const handleSearch = async(e)=>{
    e.preventDefault();
     const txt = document.getElementById("ipBar").value.toLowerCase();
     let filtered=[];
     console.log("Ques: ", Ques);
     console.log("AllQues: ", AllQues);
     AllQues && AllQues.map((q)=>{
        if(q.title.toLowerCase().includes(txt))
         filtered.push(q);
     })
     console.log("Filtered: ", filtered);
     setQues(filtered);
  }

  
  if (currUser) { profPic = currUser.profImg; }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Q&A-IIITM</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal">Ask a Question</a>
              </li>
              <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">Ask any Question</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <div className="mb-3">
                          <label htmlFor="ques-title" className="col-form-label">Title:</label>
                          <input type="text" className="form-control" id="ques-title" onChange={(e) => { settitle(e.target.value) }} required={true} minLength={3} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="ques-desc" className="col-form-label">Description:</label>
                          <textarea className="form-control" id="ques-desc" onChange={(e) => { setdesc(e.target.value) }}></textarea>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="quesImg" className="form-label">Image: (Optional)</label>
                          <input className="form-control" type="file" id="quesImg" onChange={changeHandler} />
                        </div>
                        <div className='output'>
                          {error && <div className='error' style={{ "color": "red" }}> {error}</div>}
                          <div className="progress" id="progBar">
                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={prog} aria-valuemin="0" aria-valuemax="100" style={{ "width": `${prog}%` }}></div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="ques-tags" className="col-form-label">Tags:</label>
                          <input type="text" className="form-control" id="ques-tags" onChange={(e) => { settags(e.target.value) }} />
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button id="closeBtn" type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button id="postBtn" type="button" className="btn btn-primary" onClick={handlePost}>Post</button>
                    </div>
                  </div>
                </div>
              </div>
            </ul>
          </div>
          <form className="d-flex">
            <input id="ipBar" className="form-control me-2" type="search" placeholder="Search for a question" aria-label="Search" style={{ "width": "400px" }} />
            <button className="btn btn-outline-success" style={{ "color": "white", "border": "2px solid white" }} type="submit" onClick={handleSearch}>Search</button>
            {/* <a className="nav-link active" aria-current="page" href="#" data-bs-toggle="modal" data-bs-target="#profImgModal"> */}
            <span data-bs-toggle="modal" data-bs-target="#profImgModal" style={{"cursor" :"pointer", /*"border":"2px solid white",*/ "marginLeft":"30px"}}>
            <img src={profPic} id="navProfPic" className='profImg' data-bs-toggle="tooltip" data-bs-placement="bottom"  title={currUser && currUser.username} ></img>
            </span>
            {/* </a> */}
            <div className="modal fade" id="profImgModal" tabIndex="-1" aria-labelledby="profImgModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="profImgModalLabel">Update Profile Picture</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label htmlFor="profImg" className="form-label">Image:</label>
                        <input className="form-control" type="file" id="profImg" onChange={profChangeHandler} />
                      </div>
                      <div className='output'>
                        {profError && <div className='error' style={{ "color": "red" }}> {profError}</div>}
                        {/* <div id="prog" style={{"display": "none"}}><p>Uploading ...</p></div> */}
                        <div className="progress" id="profProgBar">
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={profProg} aria-valuemin="0" aria-valuemax="100" style={{ "width": `${profProg}%` }}></div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button id="profcloseBtn" type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="profPostBtn" type="button" className="btn btn-primary" onClick={handleProfPost}>Post</button>
                  </div>
                </div>
              </div>
            </div>
            <button className='btn btn-danger' style={{ "marginLeft": "30px" }} onClick={handleLogout}>Logout</button>
          </form>
        </div>
      </nav>
    </div>
  )
}

export default Navbar