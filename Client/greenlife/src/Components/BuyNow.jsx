import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BuyNow() {
    const { id } = useParams();
    const [Totalcost, setTotalcost] = useState(0);
    const [click, setClick] = useState(false);
    const [plant, setPlants] = useState([]);

    const jwtToken = localStorage.getItem("token");

    useEffect(() => {
        if (jwtToken) {
            const getCartItems = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/cart/get/${id}`, {
                        headers: {
                            "x-auth-token": jwtToken,
                            "Content-Type": "application/json",
                        },
                    });
                    let totalCost = 0;
                    const plantsArray = response.data.plants.map(item => {
                        const cost = item.PlantCost * item.quantity;
                        totalCost += cost;
                        return {
                            Name: item.id.PlantName,
                            Number: item.quantity,
                            Cost: cost,
                            Image: item.id.PlantImage,
                        };
                    });

                    setPlants(plantsArray);
                    setTotalcost(totalCost);
                } catch (error) {
                    console.error("Error fetching cart items:", error);
                }
            };

            getCartItems();
        }
    }, [id, jwtToken]);

    const SendMail = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/${id}`, {
                headers: {
                    "x-auth-token": jwtToken,
                    "Content-Type": "application/json",
                },
            });

            const userEmail = response.data.gmail;
            const emailData = {
                mail: userEmail,
                cartDetails: plant,
                totalCost: Totalcost,
            };
            const result = await axios.post("http://localhost:3000/send-mail", emailData, {
                headers: {
                    "x-auth-token": jwtToken,
                    "Content-Type": "application/json",
                },
            });
            setClick(true);
            toast.success("Payment successful and email sent!");
        } catch (error) {
            toast.error("Failed to send email or process payment.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
        <Navbar />
        {click && (
          <div className="text-center my-16">
            <p className="text-2xl text-orange-500 font-bold">Thanks for shopping!</p>
          </div>
        )}
        <div className="container mx-auto px-6 my-20">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-3 px-6 font-semibold text-gray-700">Plant Name</th>
                  <th className="py-3 px-6 font-semibold text-gray-700">Plant Image</th>
                  <th className="py-3 px-6 font-semibold text-gray-700">Number of Plants</th>
                  <th className="py-3 px-6 font-semibold text-gray-700">Plants Cost</th>
                </tr>
              </thead>
              <tbody>
                {plant.map((p, id) => (
                  <tr key={id} className="border-b">
                    <td className="py-3 px-6 text-gray-600">{p.Name}</td>
                    <td className="py-3 px-6">
                      <img
                        src={p.Image}
                        alt="Plant"
                        className="h-12 w-12 object-cover rounded-md shadow-sm"
                      />
                    </td>
                    <td className="py-3 px-6 text-gray-600">{p.Number}</td>
                    <td className="py-3 px-6 text-gray-600 font-medium">₹{p.Cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <hr className="my-8 border-t border-gray-300" />
        </div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
            <b>Total Cost: </b>₹{Totalcost}
          </p>
          <button
            onClick={SendMail}
            className="bg-yellow-400 text-gray-800 font-medium py-2 px-6 rounded-lg shadow-md hover:bg-yellow-500 transition"
          >
            Proceed with Online Payment
          </button>
        </div>
      </div>
      
    );
}

export default BuyNow;
