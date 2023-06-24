import React, {useState, useEffect} from 'react'
import ShortQues from '../ShortQues/ShortQues'

const ShortQuesList = ({data}) => {
  
  return (
    <div className='ShortQuesList'>
         {
            data && data.map((que)=>{ 
              return <ShortQues Id={que._id}  title={que.title} desc={que.desc} dt={que.createdAt.slice(0,10)}/> 
            })
         }
    </div>
  )
  
  // return (
  //   <div className='ShortQuesList'>
  //        <ShortQues/>
  //        <ShortQues/>
  //        <ShortQues/>
  //        <ShortQues/>
  //        <ShortQues/>
  //        <ShortQues/>
  //        <ShortQues/>
  //        <ShortQues/>
  //        <ShortQues/>
  //   </div>
  // )
}

export default ShortQuesList