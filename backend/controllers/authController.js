require("dotenv").config()
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email); 
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ id: user.user_id, role: user.role }, 'yash1234', { expiresIn: '1h' });
  
    res.json({ token, role: user.role, id: user.user_id });
};

const signup = async (req, res) => {
    const { name, password, role, email } = req.body;
  
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const newUser = await User.create(name, hashedPassword, role, email);
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {login, signup};
