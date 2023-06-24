import axios from "axios";

const baseURL = "http://localhost:8000/api";

// const baseURL = "https://watch-party-sarthak.herokuapp.com/api/auth"

export const LoginCall = async (data)=>{
  const res = await axios.post(`${baseURL}/auth/login`, data, {withCredentials: true});
  return res;
}

export const RegisterCall = async (data)=>{
    const res = await axios.post(`${baseURL}/auth/register`, data, {withCredentials: true});
    return res;
}

export const getUserCall = async ()=>{
    const res = await axios.get(`${baseURL}/auth/getUser`, {withCredentials: true});
    return res;
}

export const LogoutCall = async ()=>{
    const res = await axios.get(`${baseURL}/auth/logout`, {withCredentials: true});
    return res;
}
export const updateProfPic = async (data)=>{
    const res = await axios.put(`${baseURL}/auth/updateProfImg`, data , {withCredentials: true});
    return res;
}

export const getAllQues = async ()=>{
    const res = await axios.get(`${baseURL}/question/getAll`, {withCredentials: true});
    return res;
}

export const getMyQues = async ()=>{
    const res = await axios.get(`${baseURL}/question/getByUserId`, {withCredentials: true});
    return res;
}

export const getQuesById = async (id)=>{
    const res = await axios.get(`${baseURL}/question/get/${id}`, {withCredentials: true});
    return res;
}


export const starAQues = async (id)=>{

    const res = await axios.put(`${baseURL}/question/star/${id}`, {},{withCredentials: true});
    console.log(res);
    return res;
}

export const unstarAQues = async (id)=>{
    const res = await axios.put(`${baseURL}/question/unstar/${id}`, {}, {withCredentials: true});
    return res;
}

export const getAllAnsOfAQ = async (id)=>{
    const res = await axios.put(`${baseURL}/answer/getAns/${id}`, {withCredentials: true});
    return res;
}

export const postAQues = async (data)=>{
    const res = await axios.put(`${baseURL}/question/ask`, data, {withCredentials: true});
    return res;
}

export const postAns = async (data, id)=>{
    const res = await axios.put(`${baseURL}/answer/post/${id}`, data, {withCredentials: true});
    return res;
}

export const getAnsforAQues = async (id)=>{
    const res = await axios.get(`${baseURL}/answer/getAns/${id}`, {withCredentials: true});
    return res;
}

export const AskAQues = async (data)=>{
    const res = await axios.post(`${baseURL}/question/ask`, data, {withCredentials: true});
    return res;
}

export const giveAns = async (id, data)=>{
    const res = await axios.post(`${baseURL}/answer/post/${id}`, data, {withCredentials: true});
    return res;
}

export const reportOnAns = async (id)=>{
    const res = await axios.put(`${baseURL}/answer/report/${id}`, {},{withCredentials: true});
    console.log(res);
    return res;
}

export const UnreportAAns = async (id)=>{
    const res = await axios.put(`${baseURL}/answer/unreport/${id}`, {},{withCredentials: true});
    console.log(res);
    return res;
}







