import express from 'express';
import { signup, login, logout, onboard } from  '../controllers/auth.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js'
const router = express.Router();


//  TODO : forgot-password , reset-password
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.post('/onboarding',protectedRoute, onboard)
router.get('/me', protectedRoute, (req,res)=> {
    res.status(200).json({ success: true, message: 'Logged in', user: req.user})
})
export default router;