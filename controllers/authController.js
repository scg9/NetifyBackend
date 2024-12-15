const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const registerUser = async (req, res) => {
  console.log(req,"requser")
  try {
    const { email, password, age,name} = req.body;
    const existingUser = await User.findOne({ email });
    console.log(existingUser,"existingUserofuser")
    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      console.log(isPasswordValid,"hvalid")
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      return res.status(400).json({ message: 'User already exists' });
    }
   

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, age,name });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error,"errorppp");
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  console.log(req.body,"requestbody")
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(300).json({ message: 'Please Register' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    user.jwt = token;
    await user.save();
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile= async(req,res)=>{
  try{
   const user= await User.findById(req.user.userId).select('-password') // to exclude password

   if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
  } catch(err){
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
const updateProfile = async (req, res) => {
  try {
    const { name, email, password, new_password } = req.body;
  console.log(req.body,"reqbodygetprofile")
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name and email
    user.name = name || user.name;
    user.email = email || user.email;

    // If password update is requested
    if (password ) {
      console.log(password,new_password,"passwords")
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      console.log(isPasswordMatch,"saytrue/hj")
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
      user.password = await bcrypt.hash(new_password, 10);
    }
    if(password === user.password || password == '' || new_password === ''){
      return res.status(400).json({ message: 'update your current password' });
    }
    if(password === new_password){
      return res.status(400).json({ message: 'Cannot update same password' });
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser,getProfile , updateProfile};
