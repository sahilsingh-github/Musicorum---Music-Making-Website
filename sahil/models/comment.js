var mongoose =require("mongoose");
var commentsSchema = mongoose.Schema({
    user : String,
    text : String
});
module.exports=mongoose.model("sahilcomments",commentsSchema);