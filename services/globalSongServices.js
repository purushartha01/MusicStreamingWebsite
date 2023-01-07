const globalSongsModel=require("../database/models/globalSongs");

module.exports.addNewSong=async(songObj)=>{
  // console.log("SERVICE: ",userData);
  let addSong=await globalSongsModel.create(songObj);
}

module.exports.findSong=function(globalSongName){
  return globalSongsModel.find({songname:globalSongName})
}

module.exports.findAllSongs=function(){
  return globalSongsModel.find({})
}

module.exports.updateData=async(email,songObj)=>{
  let updateSongData=await globalSongsModel.updateOne({},songObj,{upsert:true});
}
