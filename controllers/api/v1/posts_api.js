const Post = require('../../../models/post');
const Comment = require('../../../models/comment');




module.exports.index = async function(req,res){

    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate:{
            path: 'user'
        }
    });


    return res.status(200).json({
        message: 'List of posts',
        posts: posts
    });
}





module.exports.destroy = async function(req,res){

    try {

        

       let deletePost = await Post.deleteOne({_id: req.params.id, user: req.user.id});

       if(deletePost.deletedCount == 0){
        
        return res.status(401).json({
            message: 'You cannot delete this post!'
        });

       }
        await Comment.deleteMany({post: req.params.id});

       

       
        return res.status(200).json({
            message: 'Post and associated comments deleted successfully'
        })
        
    } catch (error) {
        // console.log(`Error: ${error}`);
        // return;

       
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}