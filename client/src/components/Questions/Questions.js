import React, { useState, useEffect } from 'react'
import { getAllQues } from '../../ApiCalls'
import Question from '../Question/Question'
import './Questions.css'

const Questions = ({Ques, Q1, setQ1, setQues ,currUser}) => {

  
  let starredIdArr=[];

  // console.log("curr User 9 line: ", currUser);
   const starredQues= currUser.starredQues;
   starredQues.map((s)=>{
    starredIdArr.push(s._id);
  })
   console.log("11: ", starredQues)
  useEffect(()=>{
      async function fun(){
        const res = await getAllQues();
        // console.log("13 line: ", res);
        setQues(res.data);
        setQ1(res.data);
        // console.log("15 line: ", Ques);
      }

      fun();
      
      // console.log("19 line: ", Ques);
  }, [])

  return (
    <div className='questions'>    
    {console.log("Line no. 31 starred Ques Id Arr : ", starredIdArr)}
      {
        
        Ques && Ques.map((que)=>{ 
          console.log("que from line 36: ", que);
          
          const t = que.title;
          const d = que.desc ? que.desc : null;
          const an = que.author.username;
          const ai = que.author.profImg;
          const dt = que.createdAt.slice(0,10);
          // dt=dt[8];
          const qi = que.img ? que.img : null;
          const tgs = (que.tags && que.tags.length > 0) ? que.tags : null;

          return(
          starredIdArr.includes(que._id) 
          ? <Question title={t} desc={d} an={an} ai={ai} dt={dt} qi={qi} tgs={tgs} star="bi bi-star-fill" key={que._id} Id={que._id}/> 
          : <Question title={t} desc={d} an={an} ai={ai} dt={dt} qi={qi} tgs={tgs} star="bi bi-star" key={que._id} Id={que._id}/>)
        })
      }
        {/* <Question star="bi bi-star" Id={1}/>
        <Question star="bi bi-star-fill" Id={2}/>
        <Question star="bi bi-star-fill" Id={3}/>
        <Question star="bi bi-star" Id={4}/>
        <Question star="bi bi-star" Id={5}/>
        <Question star="bi bi-star-fill" Id={6}/>
        <Question star="bi bi-star" Id={7}/>
        <Question star="bi bi-star-fill" Id={8}/>
        <Question star="bi bi-star-fill" Id={9}/>
        <Question star="bi bi-star" Id={10}/> */}
    </div>
  )
}

export default Questions