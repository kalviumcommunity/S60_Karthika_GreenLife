import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function CartCards(props){

    const[data,setdata]=useState([]);
    const{nextPage}=useNavigate();
    const plantsid=props.plantid

    useEffect(()=>{
        const Getdata=async()=>{
            const jwtToken=localStorage.getItem("token")
            if(!jwtToken){
                nextPage("/NotAuthenticated")
                return;
            }
            try{
                const respond=await axios.get(`http://localhost:3000/plant/getplant/${plantsid}`,{
                    headers : {
                        'x-auth-token' : jwtToken,
                         'Content-Type': 'application/json'
                    }
                })
                setdata(respond.data.plant)
            }catch(error){
                console.log("cartcards component error:",error)
            }
        }
        Getdata()
    },[plantsid,nextPage])
    return(
        <div>
            <Navbar></Navbar>
         <div>
            {
                data!==null? 
                <div key={data._id} className="border-4 rounded-3xl m-8 p-7 flex flex-col items-center">
                    <img src={data.PlantImage} alt="Plant Image" className="h-full w-full object-cover rounded-3xl"/>
                    <p>{data.PlantName}</p>
                    <b className="text-green-800">Rs.{data.PlantCost}</b>
                </div>:<p>There are not items in your garden</p>
            }
         </div>
        </div>
    )

}
export default CartCards;