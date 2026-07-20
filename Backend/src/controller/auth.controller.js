const usermodel=require("../models/user.model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
async function registerUser(req,res){

const {username ,email ,password , role = "user"}=req.body

const isuseralreadyexist=await usermodel.findOne({
$or:[
    {username:username},
    {email:email}
]
})
if(isuseralreadyexist){
    return res.status(409).json({message:"The user already exists" })}
const hash = await bcrypt.hash(password, 10);
const user=await usermodel.create({
    username,
    email,
    password:hash,
    role
})

const token=jwt.sign({
    id:user._id,
    role:user.role,
},process.env.JWT_SECRET)


res.cookie("token",token)

res.status(201).json({
    message:"user has registered successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email,
        role:user.role
    }
    
})
}
async function loginUser(req,res){
    const {username,email,password}=req.body;
    const isuser=await usermodel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(!isuser){
        return res.status(401).json({
            message:"Invalid Credentials, No such user exists"
        })
    }


    const ispasswordvalid=await bcrypt.compare(password,isuser.password)

    if(!ispasswordvalid){
        return res.status(401).json({
            message:"Invalid password,Try again!"
        })
    }
    const token=jwt.sign({
        id:isuser._id,
        role:isuser.role,
    },process.env.JWT_SECRET)

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "none", 
    });

    res.status(200).json({
        message:"User logged in Succesffully",
        user:{
            id:isuser._id,
            username:isuser.username,
            email:isuser.email,
            role:isuser.role
        }
    })
}

module.exports={registerUser,loginUser}