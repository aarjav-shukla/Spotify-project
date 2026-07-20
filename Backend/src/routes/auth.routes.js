const express=require("express")
const authcontroller=require("../controller/auth.controller")


const router=express.Router()

router.post("/registeruser",authcontroller.registerUser)

router.post("/loginuser",authcontroller.loginUser)


module.exports=router