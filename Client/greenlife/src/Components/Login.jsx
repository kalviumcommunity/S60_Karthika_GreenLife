import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";
function Login(){
    return(
        <div className="flex">          
            <div className="bg-left w-full h-screen">
                <img src="https://imgcdn.floweraura.com/types-of-indoor-plant-types-cover-image.jpg" alt="" className="w-full h-full"/>
            </div>
        <div className="absolute left-1/3 top-1/3 border-2 black bg-white pr-20 pt-20 pl-20 pb-20">
            <div>
            <Navbar/>
            </div>
            <div>
            <h3>Login</h3>
            <input type="text" className="border-2 black mb-5" placeholder="UserName"/>
            </div>
            <div>
            <input type="text" className="border-2 black mb-5" placeholder="Email"/>
            </div>
            <div>
            <input type="text" className="border-2 black mb-5" placeholder="Password"/>
            </div>
            <NavLink to="/order">
            <button className="bg-yellow-300">Login</button>
            </NavLink>
            <p>If, you did not have a account prefer to <a href="/signup">Signup</a></p>
        </div>
        <div className="bg-right bg-green-400 h-screen w-full"></div>
        </div>
    )
}
export default Login;