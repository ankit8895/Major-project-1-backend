const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');


module.exports.create = async function(req,res){
    // Post.create({
    //     content: req.body.content,
    //     user: req.user._id
    // })
    // .then(post =>{
    //     return res.redirect('back');
    // })s
    // .catch(error =>{
    //     console.log(`Error in creating a post: ${error}`);
    //     return;
    // });

    try {

        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });


        if(req.xhr){
            
            post = await post.populate('user', 'name')
            console.log(post);
            return res.status(200).json({
                data:{
                    post: post

                },
                message: 'Post created!'
            });
        }

        
        req.flash('success','Post Published !');
        return res.redirect('back');
        
    } catch (error) {
        // console.log(`Error: ${error}`);
        // return;

        req.flash('error',error);
        return res.redirect('back');
    }

    
}




module.exports.destroy = async function(req,res){
    // Post.findById(req.params.id)
    // .then(post =>{

    //     //.id means converting the id(._id) into the string for comparison
    //     if(post.user == req.user.id){
    //         console.log(post);
    //         post.remove();


    //         Comment.deleteMany({post: req.params.id})
    //         .then(()=>{
    //             return res.redirect('back');
    //         });

    // Post.deleteOne({_id: req.params.id, user: req.user.id})
    // .then(()=>{


    //     Comment.deleteMany({post: req.params.id})
    //         .then(()=>{
    //             return res.redirect('back');
    //         });



    //     // }else{
    //     //     return res.redirect('back');
    //     // }
    // })
    // .catch(error =>{
    //     console.log(`Error deleting the post: ${error}`);
    //     return res.redirect('back');
    // });

    try {

    //    let deletePost = await Post.deleteOne({_id: req.params.id, user: req.user.id});

    //    if(deletePost.deletedCount == 0){
    //     req.flash('error','You cannot delete this post!');
    //     return res.redirect('back');
    //    }
    //     await Comment.deleteMany({post: req.params.id});

    let post = await Post.findById(req.params.id);

    if(post.user == req.user.id){

        //CHANGE :: delete the associated likes for the post and all its comment's likes too
        await Like.deleteMany({likeable: post, onModel: 'Post'});
        await Like.deleteMany({_id: {$in: post.comments}});

        await Post.deleteOne({_id: req.params.id});
        await Comment.deleteMany({post: req.params.id});
   

        if(req.xhr){
           
            return res.status(200).json({
                data:{
                    post_id: req.params.id
                },
                message: 'Post deleted'
            });
        }

   

        req.flash('success','Post and associated comment deleted');
        
        return res.redirect('back');
    }else{
        req.flash('error','You cannot delete this post!');
        return res.redirect('back');
    }
        
    } catch (error) {
        // console.log(`Error: ${error}`);
        // return;

        req.flash('error',error);
        return res.redirect('back');
    }
}