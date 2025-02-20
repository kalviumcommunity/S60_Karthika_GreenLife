import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Navbar from "./Navbar";
import { GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import  {auth}  from "../Firebase/firebase";
function Login(){

    const[Gmail,setmail]=useState("");
    const[Password,setpassword]=useState("");
    const[user,setuser]=useState(null);
    const[display,setdisplay]=useState(false);
    const[confrim,setconfrim]=useState("");
    const Nextpage=useNavigate()

const RecordMail=(event)=>{
setmail(event.target.value)
}

const Recordpassword=(event)=>{
    setpassword(event.target.value)
}

const RecordConfrim=(event)=>{
    setconfrim(event.target.value)
}

const Onlogin=async (event)=>{
event.preventDefault();
try{
    if(user && Password==confrim){
        const responded=await axios.post("http://localhost:3000/api/users/login",{Gmail:user.email,Password:confrim},{  headers : {
             'Content-Type': 'application/json'
        }})
        localStorage.setItem("token",responded.data.jwtToken);
        Nextpage("/order")
    }else{
        const responded=await axios.post("http://localhost:3000/api/users/login",{Gmail,Password},{  headers : {
             'Content-Type': 'application/json'
        }})
        localStorage.setItem("token",responded.data.jwtToken);
        Nextpage("/order")
    }

}catch(error){
console.log("login route frontend err:",error)
toast.error("Login failed")
}
}


const HandleGoogleSignin= async()=>{
    try{
        const GoogleProvider=await new GoogleAuthProvider()
        const details=await signInWithPopup(auth,GoogleProvider)
        setdisplay(true)
        setuser(details.user)
    }catch(err){
        console.log("signin with google err:",err)
    }

}



return (
  <div className="min-h-screen bg-gray-100 py-12">
    <Navbar />
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-4">
      <div className="flex flex-col md:flex-row w-full h-auto md:h-4/5 bg-gray-200 shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center items-center h-full">
          <div>
            <img
              src="https://i.postimg.cc/WzTXNF67/Capstone-Project-1.png"
              alt="logo"
              className="h-24 w-auto mb-4 md:h-24 w-auto mb-4"
            />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <button
              className="bg-green-200 flex w-full sm:w-60 md:w-72 lg:w-80 h-12 justify-center items-center rounded-md shadow hover:bg-green-300 transition"
              onClick={HandleGoogleSignin}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                alt="google logo"
                className="h-6 w-6 mr-3"
              />
              <span className="text-sm font-semibold">Sign in with Google</span>
            </button>
          </div>
          <div className="mx-auto max-w-xs mt-8 md:mt-8">
            {!display && !user ? (
              <div>
                <p className="text-sm text-gray-600 font-medium mt-5 mb-5 text-center">
                  Or sign in with email
                </p>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-4"
                  placeholder="Email"
                  onChange={RecordMail}
                />
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-4"
                  placeholder="Password"
                  onChange={Recordpassword}
                />
                <button
                  className="w-full py-3 bg-yellow-400 rounded-lg text-sm font-bold hover:bg-yellow-500 transition"
                  onClick={Onlogin}
                >
                  Log in
                </button>
                <p className="mt-3 text-center text-sm">
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-blue-500 underline">
                    Sign up
                  </a>
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 font-medium mt-5 mb-5 text-center">
                  Welcome back{" "}
                  <b className="text-green-600">{user.displayName}</b>, please
                  enter your password
                </p>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-4"
                  placeholder="Password"
                  onChange={RecordConfrim}
                />
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-4"
                  placeholder="Confirm Password"
                  onChange={Recordpassword}
                />
                <button
                  className="w-full py-3 bg-yellow-400 rounded-lg text-sm font-bold hover:bg-yellow-500 transition"
                  onClick={Onlogin}
                >
                  Log in
                </button>
                <p className="mt-3 text-center text-sm">
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-blue-500 underline">
                    Sign up
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src="https://burst.shopifycdn.com/photos/basil-leaves-glisten-faintly-from-raindrops.jpg?width=925&exif=0&iptc=0"
            alt="leaves"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>
);

}
export default Login;