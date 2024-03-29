const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.toogleLike = async function(req,res){

    try {

        //likes/toogle/?id=abcde&type=Post

        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }


        //check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });


        //if a like already exists

        if(existingLike){
            likeable.likes.pull(existingLike.id);
            likeable.save();

            // existingLike.remove();
            await Like.deleteOne({likeable: req.query.id, onModel: req.query.type,user: req.user._id});
            deleted = true;
        }else{
            //else make a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }


        return res.status(200).json({
            message: 'Request Successful',
            data: {
                deleted: deleted
            }
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}