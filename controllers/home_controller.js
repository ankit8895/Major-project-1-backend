const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
    // console.log(req.cookies);
    // res.cookie('userId',11);




    //populate the user of each post
    // Post.find({})
    // .populate('user')
    // .populate({
    //     path: 'comments',
    //     populate:{
    //         path: 'user'
    //     }
    // })
    // .exec()
    // .then(posts =>{

    //     User.find({})
    //     .then(users =>{
    //         return res.render('home',{
    //             title: 'Codeial | Home',
    //             posts: posts,
    //             all_users: users
    //     });

    //  });
       
    // })
    // .catch(err =>{
    //     console.log(`${err}`);
    //     return;
    // });


    try {
        //populate the user of each post
        //CHANGE :: populate the likes of each post and comment
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate:{
            path: 'user'
        },
        populate:{
            path: 'likes'
        }
    }).populate('comments')
    .populate('likes');

    
    let users = await User.find({});
    let friends;
    if(req.user){
        friends = await User.findById(req.user._id)
        // .populate({
        //     path: 'friendships',
        //     populate:{
        //         path: 'from_user'
        //     }
        // })
        .populate({
            path: 'friendships',
            populate:{
                path: 'to_user'
            }
        });
    }
       
     return res.render('home',{
            title: 'Codeial | Home',
            posts: posts,
            all_users: users,
            all_friends: friends
    });
        
    } catch (error) {
        console.log(`Error: ${error}`);
        return;
        
    }   
 

 }




module.exports.contact = function(req,res){
    return res.end('<h1>Contacts will be display</h1>');
}