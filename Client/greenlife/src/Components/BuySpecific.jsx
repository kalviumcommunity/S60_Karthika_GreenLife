import Navbar from "./Navbar";
import axios from "axios";
import { useState,useEffect } from "react";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";



function BuySpecificPlant(){

    const {userid}=useParams();
    const[id,setid]=useState("");
   const[name,setname]=useState("");
   const[img,setimg]=useState("");
   const[quantity,setquantity]=useState(0);
    const[click,setclick]=useState(false);
    const[plant,setplants]=useState([]);
    const[Totalcost,setTotalcost]=useState(0);

    const jwtToken=localStorage.getItem("token");

    useEffect(()=>{
        if(jwtToken){
            const getcartitems=async ()=>{
                       try{
            const list= await axios.get(`http://localhost:3000/cart/single/${userid}`,{
                headers : {
                    'x-auth-token': jwtToken,
                     'Content-Type': 'application/json'
                }
            })
            setplants(list.data)
            setid(list.data.id)
            setquantity(list.data.quantity)
        }catch(error){
           console.log("buy specific plant error:",error)
        }
            }
            getcartitems()
        }
    },[userid,jwtToken])

    useEffect(() => {
        const getplantdetails = async () => {
            try {
                const details = await axios.get(`http://localhost:3000/plant/getplant/${id}`, {
                    headers: {
                        "x-auth-token": jwtToken,
                        "Content-Type": "application/json",
                    },
                });
    
                setname(details.data.plant.PlantName);
                setimg(details.data.plant.PlantImage);

                const plantQuantity = details.data.plant.quantity || 1;
                const plantCost = details.data.plant.PlantCost || 0;
    
                setTotalcost(plantQuantity * plantCost);
            } catch (err) {
                console.log("getplantdetails error:", err);
            }
        };
        if (userid) {
            getplantdetails();
        }
    }, [id, jwtToken]);

const SendMail = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/users/${userid}`, {
            headers: {
                "x-auth-token": jwtToken,
                "Content-Type": "application/json",
            },
        });

        const userEmail = response.data.gmail;

        const singlePurchase = {
            id: id, 
            quantity: quantity, 
            PlantCost: Totalcost, 
        };
        const result = await axios.post("http://localhost:3000/single/send-mail",{
            mail:userEmail,
            SinglePurchase:singlePurchase
        } , {
            headers: {
                "x-auth-token": jwtToken,
                "Content-Type": "application/json",
            },
        });
            setclick(true);
            toast.success("Payment successful and email sent!");
    }
        catch(error){
            toast.error("Failed to send email or process payment.");
        };
};


    return(
        <div className="min-h-screen bg-gray-50">
  <Navbar />
  <div className="container mx-auto px-4 py-10">
    {click && (
      <div className="text-center mt-6">
        <p className="text-2xl text-orange-500 font-bold">Thanks for shopping!</p>
      </div>
    )}
    <div className="bg-white border border-gray-300 rounded-3xl shadow-lg p-6 md:p-10">
      <p className="font-bold text-2xl text-gray-800 mb-5 text-center">{name}</p>
      <img
        src={img}
        alt="Plant"
        className="h-80 w-full object-cover rounded-3xl shadow-md mb-6"
      />
      <div className="space-y-3 text-gray-700">
        <p>
          <span className="font-semibold">Each Plant Cost:</span> ₹{plant.PlantCost}
        </p>
        <p>
          <span className="font-semibold">Number of Plants:</span> {plant.quantity}
        </p>
        <p>
          <span className="font-semibold">Total Cost:</span> ₹{plant.PlantCost * plant.quantity}
        </p>
      </div>
      <div className="text-center mt-8">
        <button
          className="bg-yellow-400 text-gray-800 font-medium py-3 px-6 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
          onClick={SendMail}
        >
          Proceed with Online Payment
        </button>
      </div>
    </div>
  </div>
</div>
    )
}
export default BuySpecificPlant;