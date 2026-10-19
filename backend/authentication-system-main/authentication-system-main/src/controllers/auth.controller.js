import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";



export async function register(req,res){
    const{username,email,password} = req.body;
    const isAleadyExist = await userModel.findOne({
        $or:[{username:username},{email:email}]
    })  
    if(isAleadyExist){
        return res.status(409).json({
            message:"User already exist"
        })
    }
const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
const user = await userModel.create({
    username,
    email,
    password: hashedPassword  
})
 const accessToken = jwt.sign({id:user._id},
   
    config.JWT_SECRET,
    { expiresIn: "15m" }
 )
  const refreshToken = jwt.sign({id:user._id},
    config.JWT_SECRET,
    { expiresIn: "7d" }
 )
 const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
const session = await sessionModel.create({
    userId:user._id,
    refreshTokenHash,
    ip:req.ip,
    userAgent:req.get("User-Agent")
})
 res.cookie("refresToken",refreshToken,{
    httpOnly:true,
    maxAge:7*24*60*60*1000
 })
  res.status(201).json({
    message:"User registered successfully",
    user:{
        username:user.username,
        email:user.email,
       
    },
    token:accessToken
  })
    
}
export async function login(req,res){
    const {email,password} = req.body;
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(401).json({
message:"User not found"
        })
    }
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const isPasswordValid = hashedPassword === user.password;
    if(!isPasswordValid){
        return res.status(401).json({
            message: "User not found"
        })
    }
const refreshToken = jwt.sign({
    id:user._id},config.JWT_SECRET,
    {
        expiresIn: "7d"
    }

)
const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
const session = await sessionModel.create({
    user: user._id,
    refreshTokenHash,
    ip:req.ip,
    userAgent:req.headers["user-agent"]
})
const accessToken = jwt.sign({
    id:user._id,
    sessionId: session._id},
    config.JWT_SECRET,{
        expiresIn:"15m"
    }
)
res.cookie("refreshToken",refreshToken,{
    httpOnly: true,
    secure:true,
    sameSites: "strict",
    maxAge: 7*24*60*60*1000
})
res.status(200).json({
    message:"Logged in ",
    user:{
        username:user.username,
        email:user.email,
    },accessToken,
})


}

 export async function getMe(req,res){
      const token = req.headers.authorization?.split(" ")[1];
      if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
      }
      const decoded = jwt.verify(token,config.JWT_SECRET);
const user = await userModel.findById(decoded.id)
res.status(200).json({
    username:user.username,
    email:user.email
})

 }
 export async function refreshToken(req,res){
    const refreshToken = req.cookies.refresToken;
    if(!refreshToken){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const decoded = jwt.verify(refreshToken,config.JWT_SECRET)
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked:false
    })
    if(!session){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const accessToken = jwt.sign({
        id:decoded.id},
        config.JWT_SECRET,
        {expiresIn:"15m"}
    )
     const newRefreshToken = jwt.sign({
        id:decoded.id},
        config.JWT_SECRET,
        {expiresIn:"7d"}
    )
    res.cookie("refresToken",newRefreshToken,{
        httpOnly:true,
        maxAge:7*24*60*60*1000
    })   
    res.status(200).json({
        message:"Access token refreshed successfully",
        token:accessToken
    })
 }

 export async function logout(req,res){
    const refreshToken = req.cookies.refresToken;
     if(!refreshToken){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked:false
})
if(!session){
    return res.status(400).json({
        message:"Unauthorized"
    })
}
    session.revoked = true;
await session.save();

res.clearCookie("refresToken")
res.status(200).json({
    message:"Logged out successfully"   
})
 }

 export async function logoutAll(req,res){
    const refreshToken = req.cookies.refresToken;
    if(!refreshToken){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const decoded = jwt.verify(refreshToken,config.JWT_SECRET)
    await sessionModel.updateMany({
        userId:decoded.id,
        revoked:false
    },{
        revoked:true
    })
    res.clearCookie("refresToken")
    res.status(200).json({
        message:"Logged out from all devices successfully"
    })
 }