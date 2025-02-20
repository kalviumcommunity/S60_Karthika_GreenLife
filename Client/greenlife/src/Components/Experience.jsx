import Navbar from "./Navbar"
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Experience(){
const[users,setusers]=useState([])
const[experience,setexperience]=useState("")
const[file,setfile]=useState(null)
const[needtoupdate,setneedtoupdate]=useState(false);
const[updateExp,setupdateExp]=useState("");
const[updatefile,setupdatefile]=useState(null);
const[id,setid]=useState(null)
const switchpage=useNavigate();

const jwtToken=localStorage.getItem("token")
useEffect(()=>{
    const getusers=async()=>{
        if(!jwtToken){
         switchpage("/NotAuthenticated")
         return;
        }
        try{
        const dataofusers=await axios.get("http://localhost:3000/getexp",{
            headers : {
                'x-auth-token' : jwtToken,
                 'Content-Type': 'application/json'
            }
        })
        setusers(dataofusers.data.listexp)
        }
        catch(err){
            console.log("err exp get:",err)
        }
    }
    getusers()
},[])


const UpdateRequest = async () => {
    if (!id) return;

    const userneedupdate = users.find((user) => user._id === id);
    if (!userneedupdate) return;

    try {
        let image = updatefile;

        if (updatefile && updatefile !== userneedupdate.image) {
            const createdData = new FormData();
            createdData.append("file", updatefile);
            createdData.append("upload_preset", "x31quij6");

            const generatefilelink = await axios.post(
                "https://api.cloudinary.com/v1_1/dg6izvre4/image/upload",
                createdData
            );
            image = generatefilelink.data.secure_url;
        }

        const updatedData = await axios.put(
            `http://localhost:3000/updateExp/${id}`,
            { experience: updateExp, image },
            {
                headers: {
                    "x-auth-token": jwtToken,
                    "Content-Type": "application/json",
                },
            }
        );

        const updatedExp = updatedData.data;

        setusers(
            users.map((user) =>
                user._id === id
                    ? { ...user, experience: updatedExp.experience, image: updatedExp.image }
                    : user
            )
        );

        setneedtoupdate(false);
        setupdateExp("");
        setupdatefile(null);
        setid(null);
    } catch (err) {
        console.log("Update Exp err:", err.response?.data || err.message);
    }
};

function handleinput(event){
setexperience(event.target.value)
}

async function handlefileUpload(event){
    const selectedfile=event.target.files[0];
    setfile(selectedfile);
}

const postUrExp = async (event) => {
    event.preventDefault();
    try {
        let image = "";
        if (file) {
            const createdData = new FormData();
            createdData.append("file", file);
            createdData.append("upload_preset", "x31quij6");

            const fileupload = await axios.post(
                "https://api.cloudinary.com/v1_1/dg6izvre4/image/upload",
                createdData
            );
            image = fileupload.data.secure_url;
        }
        const newdata = await axios.post(
            "http://localhost:3000/postexp",
            { experience, image },
            {
                headers: {
                    "x-auth-token": jwtToken,
                    "Content-Type": "application/json",
                },
            }
        );
        setexperience("");
        setfile(null);
        setusers([...users, newdata.data]);
    } catch (err) {
        console.log("PostExp error:", err.response?.data || err.message);
    }
};

const deleteRequest=(id)=>{
try{
    axios.delete(`http://localhost:3000/deleteExp/${id}`,{
        headers : {
            'x-auth-token' : jwtToken,
             'Content-Type': 'application/json'
        }
    })
    setusers(users.filter((user)=>user._id!==id))

}catch(err){
    console.log("delete Exp err:",err)
}
}

    return(
<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
  <div>
    <Navbar />
  </div>
  <div className="container mx-auto px-4 py-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {users.map((user) => {
        if (!user) return null;
        return (
          <div
            key={user._id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div>
              <p className="text-gray-800 text-lg font-semibold mb-4">
                {user.experience}
              </p>
              <img
                src={user.image}
                alt="User Experience"
                className="w-full h-48 rounded-lg object-cover mb-4"
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                onClick={() => {
                  setneedtoupdate(true);
                  setupdateExp(user.experience);
                  setupdatefile(user.image);
                  setid(user._id);
                }}
              >
                Update
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-red-700 transition"
                onClick={() => deleteRequest(user._id)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
  <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-6">
    <div className="flex items-center gap-4 w-full md:w-3/4">
      <label htmlFor="inputUrfiles" className="cursor-pointer">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRxjZhawty_IUsjt2xke_qk2AIZCpVd7luGJrTo-emag&s"
          alt="Upload Icon"
          className="w-10 h-10"
        />
        <input
          type="file"
          onChange={
            needtoupdate
              ? (e) => setupdatefile(e.target.files[0])
              : handlefileUpload
          }
          id="inputUrfiles"
          accept="image/*"
          className="hidden"
        />
      </label>
      <input
        type="text"
        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={
          needtoupdate ? (e) => setupdateExp(e.target.value) : handleinput
        }
        placeholder="Enter your blog experience"
        value={needtoupdate ? updateExp : experience}
      />
      </div>
      <button
        className="px-4 py-3 bg-green-500 text-white text-sm font-semibold rounded-r-lg shadow hover:bg-green-600 transition"
        onClick={needtoupdate ? UpdateRequest : postUrExp}
      >
        Post
      </button>
  </div>
</div>

    )
}
export default Experience;