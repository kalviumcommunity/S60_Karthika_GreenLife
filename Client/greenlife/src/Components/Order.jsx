import Navbar from "./Navbar";
import {jwtDecode} from "jwt-decode";
import { useState,useEffect } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";


function Order(){
    const[opt,selectedopt]=useState("All Plants");
    const[name,setname]=useState(""||"User");
    const[PlantsData,setplantsdata]=useState([]);
    const[length,setlength]=useState(0);
    const[id,setid]=useState("");
    const Nextpage=useNavigate();

    const jwt=localStorage.getItem("token")
    useEffect(
        ()=>{
            if(jwt){
                try{
                    const decodedvalue=jwtDecode(jwt);
                if(decodedvalue && decodedvalue.NewUser && decodedvalue.NewUser.id){
                    const userId=decodedvalue.NewUser.id;
                    SpecificUser(userId)
                    setid(userId)
                }else{
                    console.log("Invalid token exists in localstorage")
                }
                }catch(error){
                    console.log("jwt token error in frontend:",error)
                }
            }else{
                console.log("There is no token in localstorage")
            }
        },[])

   const SpecificUser=async(UserId)=>{
try{
    const responded= await axios.get(`http://localhost:3000/api/users/${UserId}`,{
        headers :{
            'x-auth-token':localStorage.getItem("token"),
             'Content-Type': 'application/json'
        }
    }
)
setname(responded.data.username)
}catch(error){
    console.log("Specific user details error in frontend:",error)
}
   }

    useEffect(()=>{
        const data=async()=>{
            try{
                const plantsdata=await axios.get("http://localhost:3000/plant/get")
                setplantsdata(plantsdata.data.plantlist)
            }catch(err){
                console.log(err)
            }
        }
        data()
    },[])

    useEffect(()=>{
        if(jwt){
            const getcartlength=async ()=>{
                       try{
            const cartlist= await axios.get(`http://localhost:3000/cart/get/${id}`,{
                headers : {
                    'x-auth-token': jwt,
                     'Content-Type': 'application/json'
                }
            })
            setlength(cartlist.data.plants.length)
        }catch(error){
           console.log("cart get error:",error)
        }
            }
            getcartlength()
        }
    },[id,jwt])


    function GiveRatings(x){
        let ratings="";
        for(let i=0; i<5; i++){
            if(i<x){
                ratings += "⭐"
            }
            else{
                ratings+="☆"        }
        }
        return ratings;

    }
function DirectNextPage(){
    if(!jwt){
        Nextpage('/NotAuthenticated')
    }else{
        Nextpage(`/YourGarden/${id}`)
    }
}

return (
    <div>
        <Navbar />
        <button
            className="fixed bottom-5 right-5 bg-orange-400 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-orange-500 transition-all duration-300"
            onClick={DirectNextPage}
        >
            View garden ({length})
        </button>
        <p className="m-16 text-lg sm:text-xl font-medium text-center">
        Welcome {name}<br></br>
            Dive into our diverse selection, discover expertly curated plants, and embark on a journey of growth and serenity. Happy planting!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {PlantsData &&
                PlantsData.filter(
                    (each) =>
                        opt === "All Plants" || each.PlantFilter.includes(opt)
                ).map((eachplant) => {
                    return (
                        <div
                            key={eachplant._id}
                            className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <img
                                src={eachplant.PlantImage}
                                alt="Plant"
                                className="h-48 w-full object-cover rounded-lg mb-4"
                            />
                            <b className="text-md sm:text-lg mb-2">{eachplant.PlantName}</b>
                            <p className="text-sm text-yellow-500 mb-2">{GiveRatings(eachplant.Rating)}</p>
                            <p className="text-sm text-gray-700 mb-4">Rs. {eachplant.PlantCost}</p>
                            <Link to={`/plant/getplant/${eachplant._id}`}>
                                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300">
                                    Know more about Product
                                </button>
                            </Link>
                        </div>
                    );
                })}
        </div>
    </div>
);
}
export default Order;