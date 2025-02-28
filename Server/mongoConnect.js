const mongoose=require("mongoose");
const dotenv=require("dotenv");
const PlantsData = require("./Data/PlantsData");
const Experience=require("./Data/Expdata")
dotenv.config()

function ConnectDatabase(){

mongoose.connect(process.env.Connection_String)
.then(()=>{
    console.log("Your database is connected with Project")
})
.catch((err)=>{
    console.log("database error:",err)
})
}

const plantSchema=mongoose.Schema({
    PlantName:String,
    ScientificName:String,
    PlantFilter:[String],
    FamilyName:String,
    PlantCost:Number,
    ReferenceLink:String,
    Uses : String,
    Toxicity : String,
    Cautions : String,
    WateringTips : String,
    NeedOfSunlight : String,
    PlantImage : String,
    Rating:Number
})

const UserSchema=mongoose.Schema({
    UserName : {type : String},
    Gmail : {type : String, required : true, unique : true, match: [/.+\@.+\..+/, "Please fill a valid email address"]},
    Password : {type : String, required : true, minlength: [5, "Password should be at least 5 characters long"] },
    role: { type: String, required: true }
}, { timestamps: true });


const ExpSchema=mongoose.Schema({
    experience : String,
    image : String
})
const plantArray=mongoose.Schema({
    id : {type : mongoose.Schema.Types.ObjectId, ref : 'plants'},
    quantity: {type : Number, min : 1},
    PlantCost : {type : Number, ref : 'plants'}
});

const CartSchema=mongoose.Schema({
    UserId : {type : mongoose.Schema.Types.ObjectId, ref : 'users'},
    plants : [plantArray],
    SinglePurchase : {
        id : {type : mongoose.Schema.Types.ObjectId, ref : 'plants'},
        quantity: {type : Number, min : 1},
        PlantCost : {type : Number, ref : 'plants'}
    }
})

const PlantModel=mongoose.model("plants",plantSchema)
const UserModel=mongoose.model("Users",UserSchema)
const ExpModel=mongoose.model("Experience",ExpSchema)
const CartModel=mongoose.model("Cart",CartSchema)

// PlantModel.insertMany(PlantsData)
// .then(()=>console.log("plants data is sended to database"))
// .catch((err)=>console.log("database error:",err))

module.exports={Connection: ConnectDatabase, SchemaModel : PlantModel, UsersModel:UserModel, ExpModel:ExpModel, CartModel : CartModel};