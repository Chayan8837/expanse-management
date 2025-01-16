const User = require('../models/User');
const Friends = require('../models/Friends');

// Add Friend
exports.addFriend = async (req, res) => {
    const { userId, friendId } = req.body;

    // Check for invalid input data
    if (!userId || !friendId) {
        return res.status(400).json({ msg: 'Invalid input data' });
    }
    if (userId === friendId) {
        return res.status(400).json({ msg: "Can't send friend request to yourself" });
    }

    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!user || !friend) {
            return res.status(404).json({ msg: 'User(s) not found' });
        }
        let userFriendEntry = await Friends.findOne({ userId });
        console.log("find user entry ",userFriendEntry);
        let friendFriendEntry = await Friends.findOne({ userId: friendId });
        console.log("find friend entry ",friendFriendEntry);
        
        if (!friendFriendEntry) {
            console.log("creating request for friend");
            
            friendFriendEntry = new Friends({
                userId: friendId,
                friends: [],
                requestedFriends: [{ friendId: userId, status: 'pending', requested_at: new Date() }]
            });
            await friendFriendEntry.save();
            console.log("saved entry in requestfriend");
            
        } else {
            console.log("pushing start in friend ");
            const existingFriendRequest = friendFriendEntry.requstedfriends.find(f => f.friendId.toString() === userId);
            if (existingFriendRequest) {
                console.log("already get request for friend ");
                return;
                
            }
            
                friendFriendEntry.requstedfriends.push({ friendId: userId, status: 'pending', requested_at: new Date() });
                await friendFriendEntry.save();
                console.log("friend requested saved");
                console.log(friendFriendEntry);
                
            }
        

        // If the user's Friends document doesn't exist, create it
        if (!userFriendEntry) {
            console.log("create entry in user interface");
            
            userFriendEntry = new Friends({
                userId,
                friends: [{ friendId, status: 'pending', requested_at: new Date() }],
                requstedfriends:[]
            });
            await userFriendEntry.save();
            return res.status(201).json({ msg: `Friend request sent to ${friendId}` });
            console.log("sent request");
            
        } else {
            // Check if the friend request already exists
            const existingFriendRequest = userFriendEntry.friends.find(f => f.friendId.toString() === friendId);
            if (existingFriendRequest) {
                return res.status(400).json({ msg: 'Friend request already sent' });
            }

            // Add the friend request to the user's friends list
            userFriendEntry.friends.push({
                friendId,
                status: 'pending',
                requested_at: new Date()
            });
            await userFriendEntry.save();
            return res.status(201).json({ msg: `Friend request sent to ${friendId}` });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

// Fetch Friends
exports.fetchFriends = async (req, res) => {
    const { userId } = req.params;
    try {
        const friendEntry = await Friends.findOne({ userId });
        if (!friendEntry || friendEntry.friends.length === 0) {
            return res.status(404).json({ msg: 'No friends found for this user' });
        }
        return res.status(200).json({ friends: friendEntry.friends });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

exports.fetchrequestFriends = async (req, res) => {
    const { userId } = req.params;
    try {
        const friendEntry = await Friends.findOne({ userId });
        if (!friendEntry || friendEntry.requstedfriends.length === 0) {
            return res.status(404).json({ msg: 'No friend request found for this user' });
        }
        return res.status(200).json({ requests: friendEntry.requstedfriends });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};


// Accept Friend Request
exports.acceptRequest = async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        // Find the friend entry for the user
        const userFriendEntry = await Friends.findOne({ userId });
        const friendFriendEntry= await Friends.findOne({userId:friendId});

        // Check if `userFriendEntry` exists
        if (!userFriendEntry) {
            return res.status(404).json({ msg: 'User entry not found' });
        }

        // Find the friend request in `requestedFriends`
        const existingFriendRequest = userFriendEntry.requstedfriends.find(f => f.friendId.toString() === friendId);
        const my_entry_in_friend_FiendList = friendFriendEntry.friends.find(f => f.friendId.toString() === userId);
        

        // If no friend request is found, return an error
        if (!existingFriendRequest) {
            return res.status(400).json({ msg: 'No friend request found' });
        }

        // Update the status of the friend request to 'accepted' and set `accepted_at`
        existingFriendRequest.status = 'accepted';
        existingFriendRequest.accepted_at = new Date();

        // Copy the request to the `friends` array with the same `requested_at` and new `accepted_at`
        userFriendEntry.friends.push({
            friendId,
            status: 'accepted',
            requested_at: existingFriendRequest.requested_at,
            accepted_at: existingFriendRequest.accepted_at
        });
        if (my_entry_in_friend_FiendList){
            my_entry_in_friend_FiendList.status= "accepted",
            my_entry_in_friend_FiendList.accepted_at= new Date()
        }
        // Save the updated friend entry
        await userFriendEntry.save();
        await friendFriendEntry.save();
        console.log("Request accepted and moved to friends list");

        return res.status(200).json({ msg: `Friend request accepted from ${friendId}` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};


exports.blockfriend= async(req,res)=>{
    const { userId, friendId } = req.body;

    try {
        // Find the friend entry for the user
        const userFriendEntry = await Friends.findOne({ userId });
        const friendFriendEntry= await Friends.findOne({userId:friendId});

        // Check if `userFriendEntry` exists
        if (!userFriendEntry) {
            return res.status(404).json({ msg: 'User entry not found' });
        }

        // Find the friend request in `requestedFriends`
        const his_entry_in_my_FriendList = userFriendEntry.friends.find(f => f.friendId.toString() === friendId);
        const my_entry_in_friend_FiendList = friendFriendEntry.friends.find(f => f.friendId.toString() === userId);
        

        // If no friend request is found, return an error
        if (!his_entry_in_my_FriendList) {
            return res.status(400).json({ msg: 'No friend request found' });
        }

        // Update the status of the friend request to 'accepted' and set `accepted_at`
        his_entry_in_my_FriendList.status = 'blocked';
        his_entry_in_my_FriendList.blocked_at = new Date();
            my_entry_in_friend_FiendList.status= "blocked",
            my_entry_in_friend_FiendList.blocked_at= new Date()
        
        // Save the updated friend entry
        await userFriendEntry.save();
        await friendFriendEntry.save();
        console.log("user blocked");

        return res.status(200).json({ msg: `Friend blocked ` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }

}

exports.ublockfriend= async(req,res)=>{
    const { userId, friendId } = req.body;

    try {
        // Find the friend entry for the user
        const userFriendEntry = await Friends.findOne({ userId });
        const friendFriendEntry= await Friends.findOne({userId:friendId});

        // Check if `userFriendEntry` exists
        if (!userFriendEntry) {
            return res.status(404).json({ msg: 'User entry not found' });
        }

        // Find the friend request in `requestedFriends`
        const his_entry_in_my_FriendList = userFriendEntry.friends.find(f => f.friendId.toString() === friendId);
        const my_entry_in_friend_FiendList = friendFriendEntry.friends.find(f => f.friendId.toString() === userId);
        

        // If no friend request is found, return an error
        if (!his_entry_in_my_FriendList) {
            return res.status(400).json({ msg: 'No friend request found' });
        }

        // Update the status of the friend request to 'accepted' and set `accepted_at`
        his_entry_in_my_FriendList.status = "accepted";
            my_entry_in_friend_FiendList.status= "accepted",
        
        // Save the updated friend entry
        await userFriendEntry.save();
        await friendFriendEntry.save();
        console.log("user Unblocked");

        return res.status(200).json({ msg: `Friend Unblocked ` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }

}

