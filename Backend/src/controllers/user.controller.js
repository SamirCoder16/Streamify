import User from "../models/user.model.js";
import FriendRequest from '../models/friendRequest.model.js'


export const getRecommendedUser = async (req, res) => {
  try {
    const currentuserId = req.user.id;
    const currentUser = req.user;
    const recommendedUser = await User.find({
      $and: [
        { _id: { $ne: currentuserId } }, // exclude current user.
        { _id: { $nin: currentUser.friends } }, // exclude current user friends
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error ", error: error });
  }
};
export const getMyFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select("friends")
      .populate("friends","fullname profilePic nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};
export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;
    // in this case check the recipient is me or not . coz you ca'nt send message yourself
    if (myId === recipientId)
      res.status(400).json({ message: "You can't send friend Request to yourself" });

    const recipient = await User.findById(recipientId);
    // Check if User is exist
    if (!recipient) {
      return res.status(401).json({ message: "Recipient not fount" });
    }
    // Check if is Already Friend.
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: 'You are already friends with this Id'})
    }
    //Check if request is Already exist;
    const existingRequest = await FriendRequest.findOne({
        $or: [
            { sender:myId, recipient:recipientId },
            { sender:recipientId, recipient:myId }
        ]
    });

    if(existingRequest){
        return res.status(400).json({ message: 'A friend request already exists between you and this user'})
    }

    const friendRequest = await FriendRequest.create({
        sender: myId,
        recipient: recipientId
    });
    res.status(201).json(friendRequest)

  } catch (error) {
    res.status(500).json({ message: "Internal Server error" })
  }
};

export const acceptFriendRequest = async (req,res) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if(!friendRequest){
        return res.status(404).json({ message: 'Request not found' });
    }

    // Verify if the current user is the recipient 
    if(friendRequest.recipient.toString() !== req.user.id){
        return res.status(403).json({ message: 'You are not authorized to accept this request'})
    }

    friendRequest.status = 'accepted'
    await friendRequest.save();

    //  add each user to the other's friends aray .
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender,{
        $addToSet: {friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient,{
        $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: 'friend request accepted'})

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error'})
  }
}
export const getFriendRequest = async (req,res) => {
    try {
      const incommingRequest = await FriendRequest.find({
        recipient: req.user.id,
        status: 'pending'
      }).populate('sender', 'fullname profilePic nativeLanguage learningLanguage');

      const acceptedRequest = await FriendRequest.find({
        sender: req.user.id,
        status: 'accepted',
      }).populate('recipient', 'fullname profilePic')

      res.status(200).json({ incommingRequest, acceptedRequest});
    } catch (error) {
        // console.log(error)
        res.status(500).json({ message: 'Internal Server Error'})
    }
}

export const getOutgoingFriendRequest = async (req,res) => {
  try {
    const outgoingRequest = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullname profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequest)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error'})
  }
}