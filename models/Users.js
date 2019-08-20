const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  local: {
    name:String,
    email:String,
    password:String,
    date: {
      type: Date,
      default: Date.now
    }
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    date: {
      type: Date,
      default: Date.now
    }
  },
    google: {
      id: String,
      token: String,
      email: String,
      name: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
