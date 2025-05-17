import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { acceptFriendRequest, getFriendRequest, getMyFriends, getOutgoingFriendRequest, getRecommendedUser, sendFriendRequest } from "../controllers/user.controller.js";

const router = express.Router();

// apply auth middleware to all routes . 
router.use(protectedRoute);

router.get('/', getRecommendedUser)
router.get('/friends', getMyFriends)
router.post('/friend-request/:id', sendFriendRequest)
router.put('/friend-request/:id/accept', acceptFriendRequest)
router.get('/friend-requests', getFriendRequest);
router.get('/outgoing-friend-requests', getOutgoingFriendRequest)

export default router;
