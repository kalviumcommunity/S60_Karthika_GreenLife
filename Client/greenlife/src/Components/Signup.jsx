import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase/firebase";

function Signup() {
  const [UserName, setUserName] = useState("");
  const [Gmail, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayGoogleSignIn, setDisplayGoogleSignIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleGoogleSignIn = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      setDisplayGoogleSignIn(true);
      setUser(result.user);
    } catch (err) {
      toast.error("Google Sign-In failed");
    }
  };

  const postUsers = async (event) => {
    event.preventDefault();

    if (Password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    const userData = user
        ? { UserName: user.displayName, Gmail: user.email, Password }
        : { UserName, Gmail, Password };

    if (!userData.UserName || !userData.Gmail || !userData.Password) {
        toast.error("All fields are required");
        return;
    }

    try {
        const response = await axios.post(
            "http://localhost:3000/api/users/postuser",
            userData,
            { headers: { 'Content-Type': 'application/json' } }
        );
        localStorage.setItem("token", response.data.jwtToken);
        navigate("/order");
    } catch (err) {
        if (err.response && err.response.data.validationError) {
            console.error("Validation error:", err.response.data.validationError);
            toast.error("Validation failed");
        } else {
            console.error("Signup error:", err);
            toast.error("Signup failed");
        }
    }
};


return (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <Navbar />
    <div className="flex items-center justify-center flex-grow">
      <div className="bg-white shadow-md rounded-lg w-11/12 md:w-2/3 lg:w-1/2 flex overflow-hidden">
        <div className="w-full md:w-1/2 p-6 bg-gray-50">
          <img
            src="https://i.postimg.cc/WzTXNF67/Capstone-Project-1.png"
            alt="Logo"
            className="h-20 mx-auto mb-6"
          />
          <button
            className="flex items-center justify-center bg-green-300 text-white w-full py-2 rounded-md shadow mb-4 transition"
            onClick={handleGoogleSignIn}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google"
              className="h-5 w-5 mr-3"
            />
            Sign in with Google
          </button>
          <div className="text-center text-gray-600 text-sm mb-4">
            Or sign up with email
          </div>
          <form onSubmit={postUsers}>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={UserName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={Gmail}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md shadow hover:bg-green-600 transition"
            >
              Signup
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://thumbs.dreamstime.com/b/wooden-planter-box-green-plants-welcome-sign-wooden-planter-box-green-plants-welcome-sign-created-help-326072606.jpg"
            alt="Welcome"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
);
}

export default Signup;
