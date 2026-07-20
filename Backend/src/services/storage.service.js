const {ImageKit}=require("@imagekit/nodejs")


const client=new ImageKit({
    privateKey:process.env.IMAGEKIT_PVT_KEY
})

async function upload(file){
const response =await client.files.upload({
    file:file,
    fileName:"media.mp4"+Date.now(),
    folder:"SPOTIFY_PROJECT/music"
})
return response
}

module.exports={upload}