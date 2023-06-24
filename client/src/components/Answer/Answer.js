import React from 'react'
import { reportOnAns, UnreportAAns } from '../../ApiCalls';
import './Answer.css'

const handleClickRep=async(Id, reports)=>{
    console.log(Id);
     if(document.getElementById(Id).classList.contains("bi-flag")){
          console.log("A");
          const res = await reportOnAns(Id);
          if(res.data.type === "Success"){
            document.getElementById(`${Id}R`).innerHTML=reports+1;
            document.getElementById(Id).className="bi bi-flag-fill";          
          }
     }
     else{
         console.log("B");
         const res =  await UnreportAAns(Id);
         if(res.data.type === "Success"){
           document.getElementById(`${Id}R`).innerHTML=document.getElementById(`${Id}R`).innerHTML-1;
           document.getElementById(Id).className="bi bi-flag";   
          
          }
     }
}

const Answer = ({desc, img ,aimg, author, reports, dt, flag, Id}) => {
  return (
    <div>
    <div className="card ans-card">
    <div className="card-header quesCardHeader">
    <div className='authorInfo'>
    <div><img src={aimg} className='quesProfImg'></img></div>
    <div><p className='authorName'><b>{author}</b></p></div>
    <div><p className='postDate'><i>{dt}</i></p></div>
    </div>
    </div>
    <div className="card-body">
      <div className='ansDescRep'>
      <p className="card-text">{desc}</p>
      <div id="reportFlex">
      <i style={{"marginLeft": "40px", "marginRight":"20px"}} class={flag} id={Id} onClick={()=>{handleClickRep(Id, reports)}}></i>
      <p id={`${Id}R`}>{reports}</p>
      </div>
      </div>
      {img && <img className="questionImage" src={img}></img>}
      
    </div>
  </div>
    </div>
  )
}

export default Answer