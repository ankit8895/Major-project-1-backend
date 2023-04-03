const Friendship = require('../models/friendship');
const User = require('../models/user');


module.exports.addFriend = async function(req,res){

    let existingFriendship = await Friendship.findOne({
        from_user: req.user,
        to_user: req.query.id
    });


  
    let fromUser = await User.findById(req.user);
    let toUser = await User.findById(req.query.id);

   
    let deleted = false;


    if(existingFriendship){
        toUser.friendships.pull(existingFriendship._id);
        fromUser.friendships.pull(existingFriendship._id);

        toUser.save();
        fromUser.save();

        await Friendship.deleteOne({from_user: req.user, to_user: req.query.id});

        deleted = true;
    }else{

       let newfriendship = await Friendship.create({
        to_user: req.query.id,
        from_user: req.user._id
       });

       toUser.friendships.push(newfriendship);
       fromUser.friendships.push(newfriendship);

       toUser.save();
       fromUser.save();

    }


    if(req.xhr){
        return res.status(200).json({
            deleted: deleted,
            message: 'Request Successful'
        });
    }

    console.log('populated_user');
    return res.redirect('back');
}