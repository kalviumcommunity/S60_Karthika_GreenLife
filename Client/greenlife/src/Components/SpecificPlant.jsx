import {useState,useEffect} from "react";
import Navbar from "./Navbar";
import {jwtDecode} from "jwt-decode";
import { useParams,Link,useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

function SpecificPlant(){
const {id}=useParams();
const[data,setdata]=useState(null);
const[Plantdata,setplantsdata]=useState([]);
const[quantity,setquantity]=useState(1);
const[userid,setid]=useState("");
const[PlantCost,setcost]=useState(0);
const nextPage=useNavigate();

useEffect(()=>{
    const Getdata=async()=>{
        if(!jwt){
            nextPage("/NotAuthenticated")
            return;
        }
        try{
            const respond=await axios.get(`http://localhost:3000/plant/getplant/${id}`,{
                headers : {
                    'x-auth-token' : jwt,
                     'Content-Type': 'application/json'
                }
            })
            setdata(respond.data.plant)
            setcost(respond.data.plant.PlantCost)
        }catch(error){
            console.log("Specific component error:",error)
        }
    }
    Getdata()
},[id])

const jwt=localStorage.getItem("token")

const BuyNow =async()=>{
try{
    const addData=await axios.post(`http://localhost:3000/cart/single/post/${userid}`,{id : id, PlantCost : PlantCost, quantity: quantity},{
        headers : {
            'x-auth-token' : jwt,
             'Content-Type': 'application/json'
        }
    })
    nextPage(`/buySpecificPlant/${userid}`)
}catch(err){
    console.log(err,"buynow err")
}
}

useEffect(
    ()=>{
        if(jwt){
            try{
                const decodedvalue=jwtDecode(jwt);
            if(decodedvalue && decodedvalue.NewUser && decodedvalue.NewUser.id){
                const userId=decodedvalue.NewUser.id;
                setid(userId)
            }else{
                console.log("Invalid token exists in localstorage")
            }
            }catch(error){
                console.log("jwt token error in frontend:",error)
            }
        }else{
            console.log("There is nothing in localstorage")
        }
    },[])

const AddtoCart=async (event)=>{
    event.preventDefault()
    try{
    const checkdata= await axios.get(`http://localhost:3000/cart/get/${userid}`,{
        headers : {
            'x-auth-token' : jwt,
             'Content-Type': 'application/json'
        }
    })
   const cartstatus=checkdata.data;
   const savedplant=cartstatus.plants.find(item=>item.id===id)
   if(savedplant){
    console.log("Need to update successfully")
    const updatecount=savedplant.quantity+1
    const postcart= await axios.post(`http://localhost:3000/cart/post/${userid}`,{plants : [{id, quantity : updatecount, PlantCost}]},{
        headers : {
            'x-auth-token' : jwt,
             'Content-Type': 'application/json'
        }
        })
    setquantity(updatecount)
    toast.success("Plant added to garden")
   }else{
    const postcart= await axios.post(`http://localhost:3000/cart/post/${userid}`,{plants : [{id, quantity : quantity,PlantCost}]},{
    headers : {
        'x-auth-token' : jwt,
         'Content-Type': 'application/json'
    }
    })
    toast.success("Plant added to garden")
   }
}catch(err){
    if(err.response.status===404){
        try{
            const postcart= await axios.post(`http://localhost:3000/cart/post/${userid}`,{plants : [{id, quantity : 1, PlantCost}]},{
                headers : {
                    'x-auth-token' : jwt,
                     'Content-Type': 'application/json'
                }
                })
                toast.success("Plant added to garden")
        }catch(err){
            console.log("cannot create new cart",err)
        }
    }
}

}

const AddCount=()=>{
    setquantity(prev=>prev+1)
}
const SubCount=()=>{
    setquantity(prev=>(prev>1?prev-1:1))
}

    return(
<div className="min-h-screen bg-gray-50">
  <Navbar />

  <div className="container mx-auto px-4 py-14">
    {data !== null ? (
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{data.PlantName}</h2>
          <img
            src={data.PlantImage}
            alt="Plant"
            className="h-64 w-full object-cover rounded-lg shadow-sm"
          />
          <p className="text-lg font-medium text-red-600 mt-4">₹{data.PlantCost}</p>

          <div className="flex items-center justify-center mt-4 space-x-4">
            <button
              className="text-lg px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
              onClick={AddCount}
            >
              +
            </button>
            <p className="text-base">{quantity}</p>
            <button
              className="text-lg px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
              onClick={SubCount}
            >
              -
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              className="w-full py-2 bg-yellow-400 text-base font-medium rounded shadow-sm hover:bg-yellow-500 transition"
              onClick={AddtoCart}
            >
              Plant in My Garden
            </button>
            <button
              className="w-full py-2 bg-orange-500 text-base font-medium rounded shadow-sm hover:bg-orange-600 transition"
              onClick={BuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <div className="p-4 border-l-4 border-green-500 bg-white rounded-md shadow-sm">
            <p className="text-base font-semibold text-green-600">🌿 Plant Uses and Benefits</p>
            <p className="text-sm text-gray-700 mt-2">{data.Uses}</p>
          </div>

          <div className="p-4 border-l-4 border-blue-500 bg-white rounded-md shadow-sm">
            <p className="text-base font-semibold text-blue-500">💧 Water Requirement</p>
            <p className="text-sm text-gray-700 mt-2">{data.WateringTips}</p>
          </div>

          <div className="p-4 border-l-4 border-yellow-500 bg-white rounded-md shadow-sm">
            <p className="text-base font-semibold text-yellow-500">🌞 Sunlight Requirement</p>
            <p className="text-sm text-gray-700 mt-2">{data.NeedOfSunlight}</p>
          </div>

          <div className="p-4 border-l-4 border-orange-500 bg-white rounded-md shadow-sm">
            <p className="text-base font-semibold text-orange-600">⚠️ Toxicity Levels</p>
            <p className="text-sm text-gray-700 mt-2">{data.Toxicity}</p>
          </div>

          <Link to={data.ReferenceLink} className="block">
            <div className="p-4 border-l-4 border-purple-500 bg-white rounded-md shadow-sm hover:bg-gray-100 transition">
              <p className="text-base font-semibold text-purple-600">📚 More Information</p>
              <p className="text-sm text-blue-500 mt-1 underline">{data.ReferenceLink}</p>
            </div>
          </Link>
        </div>
      </div>
    ) : (
      <div className="text-center text-lg font-medium text-gray-600">Loading...</div>
    )}
  </div>
</div>
    )
}
export default SpecificPlant;