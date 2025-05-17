import User from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js'
import { upsertStreamUser } from '../lib/stream.js';

export const signup = async (req,res)=>{
    //  Get the all user Information by req.body
 const { fullname,  email, password } = req.body;

 try {
    if(!fullname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
     }
     if(password.length < 6){
        return res.status(400).json({ message: 'password must be at least 6 characters long'})
     }
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     if(!emailRegex.test(email)){
        return res.status(400).json({ message: 'Invalid email format'})
     }

     const existingUser = await userModel.findOne({ email });
      if(existingUser){
        return res.status(400).json({ message: 'Emial Already Exist, please use another email'})
     }

     const idx = Math.floor(Math.random() * 100) + 1; // Generate a number between 1-100
     const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

     const newUser = await User.create({
        fullname,
        email,
        password,
        profilePic:randomAvatar
     })

   //   create a stream account
 try {
   await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullname,
      image: newUser.profilePic || ""
   });
   console.log(`Stream user is created for ${newUser.fullname}`);
 } catch (error) {
   res.status(500).json({ message: 'Error creating Stream user', error: error.message });
 }

     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d'
     })
     res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly: true, // Prevent XSS attacks
        sameSite: 'strict', // Prevents CSRF attacks
        secure: process.env.NODE_ENV === 'production'
     })
      
    res.status(201).json({ success: true, newUser, message: 'User Created Successfully'})
 } catch (error) {
    res.status(500).json({ success: false, message: error })
 }
}

export const login = async (req,res) => {
    const { email, password } = req.body;
    try {
      if(!email || !password) return res.status(404).json({ message: 'All fields are required '});
      
      const user = await User.findOne({ email });
      if(!user) return res.status(404).json({ message: 'Invalid emial or Password'});

      const isPasswordCorrect = await user.matchPassword(password);
      if(!isPasswordCorrect) return res.status(404).json({ message: 'Invalid email or Password'});

      const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET_KEY,{
         expiresIn: '7d'
      })
      res.cookie('jwt', token, {
         maxAge: 7 * 24 * 60 * 60 * 1000,
         httpOnly: true,
         sameSite: 'strict',
         secure: process.env.NODE_ENV === 'developement'
      });

      res.status(200).json({ success: true, user, message: 'Login Success'})

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error })
    }
}

export const logout = async (req,res) => {
   res.clearCookie('jwt');
   res.status(200).json({ success: true, message: 'Logout successful'})
}

export const onboard = async (req,res) => {
   try {
      const userId = req.user._id;

      const { fullname, bio, nativeLanguage,learningLanguage,location } = req.body;
      if(!fullname || !bio || !nativeLanguage || !learningLanguage || !location){
         res.status(400).json({ message: 'All fields are required',
            missingFields: [
               !fullname && 'fullname',
               !bio && 'bio',
               !nativeLanguage && 'nativeLanguage',
               !learningLanguage && 'learningLanguage',
               !location && 'location'
            ].filter(Boolean),
         });
      };
      const updatedUser = await User.findByIdAndUpdate(userId,{
         ...req.body,
         isOnboarded: true
      }, {new: true});

      if(!updatedUser){
         return res.status(404).json({ message: 'User Not found'})
      }
//  Update a User info on Stream
      try {
         await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullname,
            image: updatedUser.profilePic || "",
         });
         console.log(`Stream User update successfull of User : ${updatedUser.fullname}`)
      } catch (streamError) {
         console.log(`Error occured during stream onboarding : ${streamError.message}`)
      }
      
      res.status(200).json({ success: true, message: 'Update Successfull', user: updatedUser })

   } catch (error) {
      res.status(500).json({ message: 'Internal server error'})
   }
}