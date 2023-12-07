const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")
mongoose.connect("mongodb://localhost/login")


const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  mobile: Number,
  password: String,
})
mongoose.plugin(plm)
module.exports = mongoose.model("rem", userSchema);