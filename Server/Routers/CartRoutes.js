const express=require("express");
const {CartModel}=require("../mongoConnect");
// const { createCheckSchema } = require("express-validator/lib/middlewares/schema");

const CartRouter=express.Router()

async function FetchCart(request,response,next){
let yourCart;
try{
    yourCart=await CartModel.findOne({UserId : request.params.UserId}).populate('plants.id')
    if(yourCart==null){
        return response.status(404).json({note : "Cannot find user and cart"})
    }
}catch(error){
    return response.status(500).json({note : error.message})
}
response.yourCart=yourCart;
next()
}

CartRouter.get('/get/:UserId',FetchCart,(request,response)=>{
    response.json(response.yourCart)
})

CartRouter.post('/post/:UserId',async(request,response)=>{
    const plantsArray=request.body.plants;
    const singlePlant=request.body.SinglePurchase;
if(!Array.isArray(plantsArray)){
    return response.status(400).json({note : "Please include plants array"})
}
    try{
        let plantcart=await CartModel.findOne({UserId : request.params.UserId})

        if(!plantcart){
plantcart=new CartModel({
    UserId : request.params.UserId,
    plants : plantsArray,
    SinglePurchase : singlePlant
})
}else{
plantsArray.forEach(({id,quantity,PlantCost}) => {
    const plantIndex=plantcart.plants.findIndex(i=>i.id.toString()==id)
    if(plantIndex>-1){
        plantcart.plants[plantIndex].quantity+=quantity;
        plantcart.plants[plantIndex].PlantCost+=PlantCost;
    }else{
        plantcart.plants.push({id,quantity,PlantCost})
    }
    
});
if(singlePlant){
    plantcart.SinglePurchase=singlePlant;
}
        }
        const CartList=await plantcart.save();
            response.status(201).json(CartList)
    }catch(error){
        response.status(400).json({note : error.message})
    }
}
)

CartRouter.delete('/delete/:Userid/:plantid',async(request,response)=>{
    const{Userid,plantid}=request.params;
    try{
        const findcart=await CartModel.findOne({ UserId : Userid })
        if(!findcart){
            return response.status(404).json({note : "There is no user with provided cart."})
        }
        const selectplant=findcart.plants.findIndex(p=>p.id.toString()==plantid);
        if(selectplant>-1){
            findcart.plants.splice(selectplant,1)
            const updatedcart= await findcart.save()
            return response.status(200).json(updatedcart)
        }else{
          return response.status(404).json({note : "plant not found in cart"})
        }
    }catch(err){
        return response.status(500).json({note : err.message})
    }

})

CartRouter.get('/single/:UserId',async(request,response)=>{
    try{
        const Oneplant=await CartModel.findOne({UserId : request.params.UserId})
        if(!Oneplant){
            return response.status(404).json({note : "there is no single purchase for present user."})
        }
        response.json(Oneplant.SinglePurchase)
    }catch(err){
        response.status(500).json({note : err.message})
    }
})

CartRouter.post("/single/post/:UserId",async(request,response)=>{
    const{id,quantity,PlantCost}=request.body;
    if(!id||!quantity||!PlantCost){
        return response.status(400).json({note : "please provide all details"})
    }
    try{
        let plantArray= await CartModel.findOne({UserId : request.params.UserId});
        if(!plantArray){
            plantArray= new CartModel({
                UserId : request.params.UserId,
                SinglePurchase : {id, quantity,PlantCost}
            })
        }else{
            plantArray.SinglePurchase={id, quantity,PlantCost}
        }
        const cartitems=await plantArray.save();
        response.status(201).json(cartitems.SinglePurchase)
    }catch(err){
        response.status(400).json({note : err.message})
    }
})

module.exports=CartRouter;
