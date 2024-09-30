
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
 
// Register a new user
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// login a user


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({message: 'Invalid credential'})
        }

        const isMatch = await bcrypt.compare(password, user.password);  
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credential'})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({token});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server error'})
    }
  
}


const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message: 'Server error'})
    }
}





module.exports = { register, login, getUserDetails };
