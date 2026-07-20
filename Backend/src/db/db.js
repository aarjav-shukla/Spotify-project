const mongoose=require("mongoose")


async function connectdb(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected successfully")
    } catch (err) {
        console.log("Database cnnection error",err)
    }
}


module.exports=connectdb