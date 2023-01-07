const mongoose=require("mongoose");

const uri="mongodb+srv://app:fgh@cluster0.h1pxau9.mongodb.net/MusicStreamingWebsite?retryWrites=true&w=majority";

module.exports=function(){
  return mongoose.connect(uri);
}