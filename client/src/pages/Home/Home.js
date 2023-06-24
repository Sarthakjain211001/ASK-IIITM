import React,{useState, useEffect} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Questions from '../../components/Questions/Questions'
import ShortQuesList from '../../components/ShortQuesList/ShortQuesList'
import './Home.css'
import { getMyQues } from '../../ApiCalls';

const Home = ({currUser, setCurrUser}) => {

    const [myPosts, setmyPosts] = useState(null);
    const [Ques, setQues] = useState(null);
    const [Q1, setQ1] = useState(null);

    useEffect(()=>{
      async function fun(){
        const res1 = await getMyQues();
        console.log(res1);
        setmyPosts(res1.data);
      }
      fun();
    }, [])


    return (
        <div>
            <Navbar Q1={Q1}  setQ1={setQ1} Ques={Ques} setQues={setQues} currUser={currUser} setCurrUser={setCurrUser}/>
            <div className="cont">
                <div className="row bottom">
                    <div className="quesList">
                        <Questions Q1={Q1}  setQ1={setQ1} Ques={Ques} setQues={setQues} currUser={currUser}/>
                    </div>
                    <div className="sideMenu">
                        <div className='first'>
                          <div className='shortLH'>
                             <hr className='hLine'/>
                              <p>My Posts</p>
                              <hr className='hLine'/>
                          </div>
                          <div className='fList'>
                             {myPosts && <ShortQuesList data={myPosts}/>}
                           </div>
                        </div>
                        <div className='second'>
                           <div className='shortLH'>
                              <hr className='hLine2'/>
                              <p>Starred Posts</p>
                              <hr className='hLine2'/>
                            </div>
                           <div className='sList'>
                             {currUser && <ShortQuesList data={currUser.starredQues}/>}
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home