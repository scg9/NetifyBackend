const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  name:{ type: String ,required: true },
  jwt: { type: String ,default: null  },

});

const User = mongoose.model('User', userSchema);
module.exports = User;
