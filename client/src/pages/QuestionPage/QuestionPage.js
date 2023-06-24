import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAnsforAQues, getQuesById, giveAns } from '../../ApiCalls'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'
import firebaseApp from '../../firebase/config';
import Answer from '../../components/Answer/Answer'
import Navbar from '../../components/Navbar/Navbar'
import Question from '../../components/Question/Question'
import './QuestionPage.css'

const QuestionPage = ({currUser, setCurrUser}) => {
    // const [ID, setID] = useState(null);
    // if(id){setID(id); }

    const {id} = useParams();
    const [ques, setques] = useState(null);
    const [ans, setAns] = useState(null);

    const [desc, setdesc] = useState(null);
    const [img, setimg] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const [url, setUrl] = useState(null);

    useEffect(()=>{
        console.log("Inside useEff line 16")
        console.log("id: ", id)
     async function fun(){
        if(id){
            console.log("id line 18: ", id)
         const res = await getQuesById(id);
         console.log("Line no 18 quesPage: ", res);
         if(res && res.data){
             setques(res.data);
         }

         const resAns = await getAnsforAQues(id);
         if(resAns && resAns.data){
             console.log("Line 31 : resAns.data : ", resAns.data)
            setAns(resAns.data);
        }


        }
     }

     fun();
    },[])

    const handleChangeAnsImg = (e)=>{
      console.log("Blocking prog and btn");    
      document.getElementById("ansPostBtn").disabled = true;
      let selected = e.target.files[0];   //some selectors allow us to choose multiple files. So files property returns an array. But here in our project we are imlpementing the selector which can choose only one file

      if (selected && allowedTypes.includes(selected.type)) {          //If selected is not null and it's type is included in allowedTypes array then olny setFile
       setFile(selected);
      }
    }

    useEffect(() => {
        console.log("60 running use effect");
        if (file) {
          console.log("calling ansImgUpload inside use Effect");
          ansImgUpload("question");
        }
      }, [file])
      const ansImgUpload = () => {
        console.log("inside ans img upload");
        const storage = getStorage(firebaseApp);
        const name = uuidv4()
        const storageRef = ref(storage, name);
        
        const uploadTask =  uploadBytesResumable(storageRef, file);
    
        uploadTask.on('state_changed',
          (snapshot) => {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;   //percentage of the image uploaded
            console.log("Perc: ", percentage);
            //   console.log("setting ans perc in upload");
            //  setProg(percentage);
            
          },
          (error) => {
            console.log(error);
             setError(error);
          },
          async () => {
            const Url = await getDownloadURL(uploadTask.snapshot.ref)    //get the downloadUrl from the reference of the uploaded image            
          
              console.log("setting ans url in upload");
             setUrl(Url);
            console.log("inside img upload URL 42 : ", Url);
          }
        );
      }
      useEffect(() => {
        if (url) {
          console.log("got ans url in useEffect .... unblocking btn");
          // document.getElementById("prog").style.display = "none";
          document.getElementById("ansPostBtn").disabled = false;
          setError("");
        }
      }, [url])

    const handlePost = async(e)=>{
        e.preventDefault();
        const data={
            desc : desc,
            img : url ? url : null
        }
        console.log("Data from 58: ", data)
         const res = await giveAns(id, data);
         console.log(res.data)
         window.alert(res.data.msg);
        //  res.data.ans.
         res.data.ans.author={
             username : currUser.username,
             profImg : currUser.profImg
         }
         setAns([...ans, res.data.ans]);
    }

    // console.log("Line no 11 QuestionPage: ", id);
    
          
    return (
        <div>
            <Navbar currUser={currUser} setCurrUser={setCurrUser}/>
            <div className='quesPage'>
             {ques &&  <Question title={ques.title} desc={ques.desc ? ques.desc : null} an={ques.author.username} ai={ques.author.profImg} dt={ques.createdAt.slice(0,10)} qi={ques.img ? ques.img : null} tgs={(ques.tags && ques.tags.length > 0) ? ques.tags : null} star={null} Id={id} />}
            
            {
                currUser.iiitmStudent && 
                <div className='ansForm card'>
                <p>Give your answer: </p>
                <form>
                    <div className="mb-3">
                        <label for="ans-desc" className="col-form-label">Description:</label>
                        <textarea className="form-control" id="ans-desc" onChange={(e)=>{setdesc(e.target.value)}}></textarea>
                    </div>
                    <div className="mb-3">
                        <label for="ansImg" className="form-label">Image: (Optional)</label>
                        <input className="form-control" type="file" id="ansImg" onChange={handleChangeAnsImg}/>
                    </div>
                    <button id="ansPostBtn" type="submit" className="btn btn-primary" onClick={handlePost}>Submit</button>
                </form>
            </div>}
<div className='othersAnsH'>
<hr className='hLine1'/>
<h5>Answers by other users</h5>
<hr className='hLine3'/>
</div>
            <div className='answers'>
               
               {
                   currUser && ans && ans.map((a)=>{
                       console.log("Inside answer map")
                    return(
                        currUser.reportedOn.includes(a._id)
                        ? <Answer desc={a.desc} img={a.img} author={a.author.username} aimg={a.author.profImg} reports={a.reports} dt={a.createdAt.slice(0,10)} flag="bi bi-flag-fill" key={a._id} Id={a._id}/>
                        : <Answer desc={a.desc} img={a.img} author={a.author.username} aimg={a.author.profImg} reports={a.reports} dt={a.createdAt.slice(0,10)} flag="bi bi-flag" key={a._id} Id={a._id}/>
                    )
                   })
               }
                {/* <Answer flag="bi bi-flag" Id={1}/>
                <Answer flag="bi bi-flag -fill" Id={2}/>
                <Answer flag="bi bi-flag-fill" Id={3}/>
                <Answer flag="bi bi-flag" Id={4}/>
                <Answer flag="bi bi-flag" Id={5}/>
                <Answer flag="bi bi-flag-fill" Id={6}/> */}
            </div>
            </div>
        </div>
    )
}

export default QuestionPage