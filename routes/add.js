const mongoose = require("mongoose");

const add = mongoose.Schema({
     date: String,
     subject: String,
     textarea: String,
     email: String,
     mobile: String,
     sms: String,
     days: String
})
module.exports = mongoose.model("add", add)