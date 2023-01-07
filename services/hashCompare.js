const bcrypt=require("bcrypt");

module.exports.hashPassword=async(password)=>{
  var saltRounds=10;
  var hashedPassword=await bcrypt.hash(password,saltRounds);
  return hashedPassword;
}

module.exports.comparePassword=function(password,savedPassword){
  return bcrypt.compare(password,savedPassword);
}