import axios from "axios";
import Navbar from "./Navbar";
import {useState,useEffect} from "react";
import CartCards from "./CartCards";
import { useNavigate, useParams, Link } from "react-router-dom";


function ViewGarden(){

    const {next}=useNavigate()
    const {id}=useParams()
    const[jwtToken,settoken]=useState("")
    const[cart,setcart]=useState(null)

    useEffect(()=>{
        const secure=async()=>{
          const findtoken=localStorage.getItem("token")
          settoken(findtoken)
          if(!findtoken){
               next("/NotAuthenticated")
               return;
          }
    }
    secure()},[])

    useEffect(()=>{
        if(jwtToken){
            const getcartitems=async ()=>{
                       try{
            const cartlist= await axios.get(`http://localhost:3000/cart/get/${id}`,{
                headers : {
                    'x-auth-token': jwtToken,
                     'Content-Type': 'application/json'
                }
            })
            setcart(cartlist.data.plants)
        }catch(error){
           console.log("cart get error:",error)
        }
            }
            getcartitems()
        }
    },[id,jwtToken])

    const deleteRequest=(plantid)=>{
        try{
            axios.delete(`http://localhost:3000/cart/delete/${id}/${plantid}`,{
                headers : {
                    'x-auth-token' : jwtToken,
                     'Content-Type': 'application/json'
                }
            })
            setcart(cart.filter((user)=>user.id._id!==plantid))
        
        }catch(err){
            console.log("delete cart plant err:",err)
        }
        }

    return(
<div className="min-h-screen bg-gray-50">
  <div>
    <Navbar />
  </div>
  <div className="container mx-auto px-4 py-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cart && cart.map((each) => {
        if (!each) return null;
        return (
          <div
            key={each._id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <CartCards plantid={each.id._id} />
            <p className="text-gray-700 font-medium mt-4">
              Number of plants: {each.quantity}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-red-600 transition"
              onClick={() => deleteRequest(each.id._id)}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  </div>
  <Link to={`/Buynow/${id}`}>
    <button className="fixed bottom-5 right-5 px-6 py-3 bg-orange-500 text-white text-sm font-semibold rounded-full shadow hover:bg-orange-600 transition">
      Buy Now
    </button>
  </Link>
</div>
    )
}
export default ViewGarden