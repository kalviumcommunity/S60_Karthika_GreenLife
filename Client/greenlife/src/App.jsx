import './App.css';
import {Routes,Route} from "react-router-dom";
import Login from './Components/Login';
import Main from "./Components/Home";
import Signup from './Components/Signup';
import SpecificPlant from "./Components/SpecificPlant"
import Experience from "./Components/Experience";
import Order from "./Components/Order";
import BuySpecificPlant from './Components/BuySpecific';
import NotAuthenticated from './Components/NotAuthenticated';
import BuyNow from './Components/BuyNow';
import ViewGarden from './Components/ViewGarden';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import About from './Components/About';

function App() {

  return (
    <Routes>
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/' element={<Main/>}></Route>
    <Route path='/Signup' element={<Signup/>}></Route>
    <Route path='/Experience' element={<Experience/>}></Route>
    <Route path='/order' element={<Order/>}></Route>
    <Route path='/YourGarden/:id' element={<ViewGarden/>}></Route>
    <Route path="/plant/getplant/:id" element={<SpecificPlant/>}></Route>
    <Route path='/Buynow/:id' element={<BuyNow/>}></Route>
    <Route path='/buySpecificPlant/:userid' element={<BuySpecificPlant/>}></Route>
    <Route path='/about' element={<About/>}></Route>
    <Route path='/NotAuthenticated' element={<NotAuthenticated/>}></Route>
  </Routes>
  )
}

export default App