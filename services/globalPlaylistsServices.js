const globalPlaylistsModel=require("../database/models/globalPlaylists");

module.exports.addNewPlaylist=async(playlistObj)=>{
  let addPlaylist=await globalPlaylistsModel.create(playlistObj);
}

module.exports.findPlaylist=function(globalPlaylistName){
  return globalPlaylistsModel.find({playlistname:globalPlaylistName})
}

module.exports.findAllPlaylists=function(){
  return globalPlaylistsModel.find({})
}

module.exports.updateData=async(name,PlaylistObj)=>{
  let updatePlaylistData=await globalPlaylistsModel.updateOne({playlistname:name},PlaylistObj,{upsert:true});
}
