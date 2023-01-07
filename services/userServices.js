const userModel=require("../database/models/users");

module.exports.createNewUser=async(userData)=>{
  console.log("SERVICE: ",userData);
  let createUser=await userModel.create(userData);
}

module.exports.findUser=function(email){
  return userModel.find({Email:email})
}

module.exports.findUserByName=function(name){
  return userModel.find({username:name})
}

module.exports.updateData=async(email,userData)=>{
  let createUser=await userModel.updateOne({Email:email},userData,{upsert:true});
}

module.exports.updateDataByName=async(name,userData)=>{
  let createUser=await userModel.updateOne({username:name},userData,{upsert:true});
}