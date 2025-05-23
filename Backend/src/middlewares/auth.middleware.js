import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'


export const protectedRoute = async (req,res,next) => {
 try {
    const token = req.cookies.jwt;

    if(!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided ' });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if(!decode){
      return res.status(401).json({ message: 'Unauthorized - Invalid token '})
    }
    const user = await User.findById(decode.userId).select('-password');
    if(!user) return res.status(401).json({ message: 'Unauthorized - user not found'});
  
    req.user = user;
    next();
 } catch (error) {
    res.status(500).json({ message: 'Internal Server Error '});
 }
}