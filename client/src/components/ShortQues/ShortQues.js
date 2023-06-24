import React from 'react'
import { Link } from 'react-router-dom'
import './ShortQues.css'

const ShortQues = ({Id, title, desc, dt}) => {
  return (
    <div className="card ShortQues-card">
    {/* <div className="card-header quesCardHeader">
    <div className='authorInfo'>
    <div><img src='https://cdn1.vectorstock.com/i/1000x1000/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg' className='quesProfImg'></img></div>
    <div><p className='authorName'><b>Sarthak jain</b></p></div>
    <div><p className='postDate'><i>7 March, 2022</i></p></div>
    </div>
    </div> */}
    <div className="card-body">
    <Link to={`/ques/${Id}`}><h5 className="card-title">{title}</h5></Link>
      {/* <h5 className="card-title">{title}</h5> */}
      <p><i>{dt}</i></p>
      <p className="card-text">{desc}</p>
      {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
    </div>
  </div>
  )
}

export default ShortQues