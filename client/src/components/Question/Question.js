import React from 'react'
import { Link } from 'react-router-dom';
import { starAQues, unstarAQues } from '../../ApiCalls';
import './Question.css'

const handleClick=async(Id)=>{
  console.log(Id);
   if(document.getElementById(Id).classList.contains("bi-star"))
      {console.log("A");
      console.log(starAQues);
      const res1 = await starAQues(Id);
      console.log(res1);
      if(res1.status === 200)
        document.getElementById(Id).className="bi bi-star-fill";}
   else{
       console.log("B");
       const res2 = await unstarAQues(Id);
       document.getElementById(Id).className="bi bi-star";   
      }
}
// title={t} desc={d} an={an} ai={ai} dt={dt} qi={qi} tgs={tgs}

const Question = ({title, desc, an, ai, dt, qi, tgs, star, Id}) => {
  console.log("Inside que");
  return (
    <div className="card ques-card">
    <div className="card-header quesCardHeader">

    <div className='authorInfo'>
    <div><img src={ai} className='quesProfImg'></img></div>
    <div><p className='authorName'><b>{an}</b></p></div>
    <div><p className='postDate'><i>{dt}</i></p></div>
    </div>
    </div>
    <div className="card-body">
      <div className='quesTitle'>
      <Link to={`/ques/${Id}`}><h5 className="card-title">{title}</h5></Link>
      {console.log("star is:" , star)}
      {star && <i className={star} id={Id} onClick={()=>handleClick(Id)}></i>}
      </div>
      
      <div className="tags">
      { 
      tgs && tgs.map((tag)=>{ return <h6><span className="tag badge bg-secondary">{tag}</span></h6>})      
      }
      </div>
      <p className="card-text">{desc}</p>
      {qi && <img className="questionImage" src={qi}></img>}
      <br/>
      
    </div>
  </div>
  )
}

export default Question