mongoose       =  require("mongoose");
var registerSchema = new mongoose.Schema({
    username: String,
    email: String,
    password:String,
});
module.exports=mongoose.model("sahilregister", registerSchema);