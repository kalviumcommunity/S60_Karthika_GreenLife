const jwt=require("jsonwebtoken")

function Authentication(request,response,next){
const Safetoken=request.header('x-auth-token');
if(!Safetoken){
    return response.status(401).json({note : 'Not authorized'})
}
try{
    const decodeToken=jwt.verify(Safetoken,process.env.Secret_key);
    request.user=decodeToken.user;
    next()
}catch(err){
    response.status(401).json({note : "Token is not valid"})
}
}

module.exports=Authentication;