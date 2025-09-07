const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();

const User = require('../models/user-schema');

//base rooot for all users
router.get('/', async (req, res) => {
        try{
                const allUsers = await User.find();
                console.log("Users Fetched.");
                return res.status(200).json({message: "Found", data: allUsers});
        }catch(error) {
                console.log("Error: ", error);
                
                return res.status(400).send(error);
        }
});

router.get('/:id', async (req, res) => {
        const {id} = req.params;

        try {
                const singleUserCredentials = await User.findById(id);

                if(!singleUserCredentials) {
                        console.log("Id invalid");
                        return res.status(400).json({message: "Invalid ID"});
                }
                console.log(singleUserCredentials);
                return res.status(200).json({singleUserCredentials})
                
        } catch (error) {
                console.log(error);
                return res.status(500).json({error: error.message});          
        }
});

//Register route for registering the new user
router.post('/auth/register', async (req, res) => {
        const {name, email, password} = req.body;

        if (!name || name.length < 3 || name.length > 30) {
        console.log("Name can't be empty and must be between 3 to 30 characters");
        return res.status(400).json({
            message: "Name can't be empty and must be between 3 to 30 characters"
        });
    }

        if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                console.log("Email not valid.");
                return res.status(400).send({message: "Email not valid."});
        }

        if (!password || password.length < 6 || password.length > 50) {
        console.log("Password should be between 6 to 50 characters");
        return res.status(400).json({
            message: "Password should be between 6 to 50 characters"
        });
    }

        try {
                const isEmail = await User.findOne({email});
                if(isEmail) {
                        console.log("Please login email is already registered.");
                        return res.status(400).json({message: "Please login email is already registered."});                        
                }
        
                const hashPassword = await bcrypt.hash(password, 10);

                const newUser = await User.create({
                        name,
                        email,
                        password: hashPassword
                });
                newUser.save();

                console.log(newUser);
                return res.status(201).json({message: "Data created.", data: newUser});
                
        }catch(error) {
                console.log(error);
                return res.status(500).json({error});
                
        }
        
});

//This route for ligging in the existing user
router.post('/auth/login', async (req, res) => {
        const {email, password} = req.body;

        if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                console.log("Email not valid.");
                return res.status(400).send({message: "Email not valid."});
        }

        

        try {
                const isUser = await User.findOne({email});

                if(!isUser) {
                        console.log("Register First");
                        return res.status(401).json({message: "Please register first."})
                }
                const hashPassword = isUser.password;
                
                const passwordMatch = await bcrypt.compare(password, isUser.password);
                console.log(passwordMatch, password, isUser);
                
                if(!passwordMatch) {
                        console.log("Wrong password");
                        return res.status(400).json({message: "Wrong password"});
                }

                const token = await jwt.sign({id: isUser._id, name: isUser.name, email: isUser.email, role: isUser.role}, process.env.JWT_SECRET_KEY, {expiresIn: '5h'});
                console.log(token);
                

                return res.status(200).json({message: "Login succesfull",
                        token,
                        user: {
                                id: isUser._id,
                                name: isUser.name,
                                role: isUser.role,
                                email: isUser.email
                        }
                });

        }catch(error) {
                console.log(error);
                return res.status(500).json({error: error.message});
                
        }
});

router.put('/update-user/:id', async (req, res) => {
        const {id} = req.params;
        const {password, name} = req.body;

        try{
                const user= await User.findById(id);

                if(!user){
                        console.log("Account not found");
                        return res.status(400).json({message: "Account not found."})
                }

                if(name === user.name){
                        console.log("This is similar to previous name");
                        return res.status(400).json({message: "Name is same as previous."});                        
                }

                if (password) {
            req.body.password = await bcrypt.hash(password, 10);  // Hash new password
        }

        
                await User.findByIdAndUpdate(id, req.body);
                const updatedUser = await User.findById(id);

                console.log("Account Updated", updatedUser);
                return res.status(201).json({updatedUser})
                
        }catch(error){
                console.log(error);
                return res.status(500).json({message: error.message});
                
        }
});

router.delete('/delete-user', async (req, res) => {
  const { email } = req.body;

  // ✅ 1. Validate email presence and format
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // ✅ 2. Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ 3. Delete the user
    await User.findByIdAndDelete(user._id); // or use .deleteOne({ _id: user._id })

    console.log(`User account deleted: ${email}`);

    // ✅ 4. Use correct status code: 200 or 204
    return res.status(200).json({ message: "Account deleted successfully" });

  } catch (error) {
    console.error("Error deleting user:", error); // better logging
    return res.status(500).json({ message: "Server error. Could not delete account." });
  }
});

router.post('/check-email', async (req, res) => {
  const { email } = req.body; // Now safe ✅

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email. Please register first." });
    }

    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error in /check-email:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Example: back-end/routes/userRoute.js
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;