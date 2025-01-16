const express = require('express');
const router=express.Router()
const {addFriend,fetchFriends,fetchrequestFriends,acceptRequest,blockfriend,ublockfriend} = require('../controllers/friendController')



router.get('/:userId',fetchFriends)


//addFriend function
router.post('/addfriend',addFriend)

//
router.get('/requests/:userId',fetchrequestFriends)

//
router.post('/acceptrequest',acceptRequest);
router.put("/blockfriend",blockfriend);
router.put("/unblockfriend",ublockfriend)




module.exports = router;