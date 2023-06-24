import logo from './logo.svg';
import './App.css';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Home from './pages/Home/Home';
import QuestionPage from './pages/QuestionPage/QuestionPage';
import { useState } from 'react';

function App() {

  const [currUser, setCurrUser] = useState(null);

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={currUser ? <Home currUser={currUser} setCurrUser={setCurrUser} /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={currUser ? <Navigate replace to="/" /> : <Login currUser={currUser} setCurrUser={setCurrUser} />} />
        <Route path="/register" element={currUser ? <Navigate replace to="/" /> : <Register currUser={currUser} setCurrUser={setCurrUser} />} />
        <Route path="/ques/:id" element={currUser ? <QuestionPage currUser={currUser} setCurrUser={setCurrUser}/> : <Navigate replace to="/login" />} />
        <Route path="*" element={"Page not found"} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
