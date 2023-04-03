const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');


module.exports.create = async function(req,res){
    // Post.findById(req.body.post)
    // .then(post =>{
    //     if(post){
    //         Comment.create({
    //             content: req.body.content,
    //             post: req.body.post,
    //             user: req.user._id
    //         })
    //         .then(comment =>{
    //             post.comments.push(comment);
    //             post.save();

    //             res.redirect('/');
    //         })
    //         .catch(error =>{
    //             console.log(`Error in creating comment: ${error}`);
    //             return;
    //         });
    //     }
    // });

    try {
        let post = await Post.findById(req.body.post);

        if(post){
           let comment = await Comment.create({
                     content: req.body.content,
                     post: req.body.post,
                    user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email');
            // commentsMailer.newComment(comment);

            let job = queue.create('emails',comment).save(function(err){
                if(err){
                    console.log(`Error in sending to the queue: ${err}`);
                    return;
                }

                console.log('job enqueued', job.id);
            })

            if(req.xhr){


               
                return res.status(200).json({
                    data:{
                        comment: comment
                    },
                    message: 'Comment Created!'
                });
            }

            req.flash('success','Comment added !!!');
            return res.redirect('/');
        }
        
    } catch (error) {
        // console.log(`Error: ${error}`);
        // return;

        req.flash('error',error);
        return res.redirect('/');

        
    }
    
}




module.exports.destroy = async function(req,res){
    // Comment.findOne({_id: req.params.id, user:req.user.id})
    // .then(comment=>{
    //     let postId = comment.post;

    //     Comment.deleteOne({_id:req.params.id})
    //     .then(()=>{

    //         Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}})
    //         .then(()=>{
    //             return res.redirect('back');
    //         })
    //         .catch(error =>{
    //             console.log(`Error in updating the comment array in the post: ${error}`);
    //             return res.redirect('back');
    //         });
    //     })
    //     .catch(error=>{
    //         console.log(`Error in deleting the comment: ${error}`);
    //         return res.redirect('back');
    //     });
    // })
    // .catch(error=>{
    //     console.log(`Error in finding the post: ${error}`);
    //     return res.redirect('back');
    // });

    try {
        // let comment = await Comment.findOne({_id: req.params.id, user:req.user.id});
        // if(!comment){

        //     req.flash('error','You cannot delete this comment');
        //     return res.redirect('back');
        // }

        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){

            let postId = comment.post;
            await Comment.deleteOne({_id:req.params.id})
            let post  = await Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}});
    
            //CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
    
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment_id: req.params.id
                    },
                    message: 'Post Deleted !'
                });
            }
            req.flash('success','Comment deleted');
            return res.redirect('back');

        }else{
            req.flash('error','Unauthorized');
            return res.redirect('back');
        }
       

    } catch (error) {
        // console.log(`Error: ${error}`);
        // return;

        req.flash('error',error);
        return res.redirect('/');
    }


}