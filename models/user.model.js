const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  old: String,
  address: String,
  role: { type: String, default: "User" },
  phone: String,
  email: String,
  password: String,
});
module.exports = mongoose.model("user", userSchema);
