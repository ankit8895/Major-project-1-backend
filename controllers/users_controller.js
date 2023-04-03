const User = require('../models/user');
const Friendship = require('../models/friendship');
const path = require('path');
const fs = require('fs');


//let's keep it the same as before as there is no nesting level
module.exports.profile = async function(req,res){

    try {

        let user = await User.findById(req.params.id);

        let friendship1,friendship2;

        friendship1 = await Friendship.findOne({
            from_user: req.user,
            to_user: req.query.id
        });

        friendship2 = await Friendship.findOne({
            from_user: req.query.id,
            to_user: req.user
        });

        let populated_user = await User.findById(req.user).populate('friendships');
        

        return res.render('user_profile',{
            title: 'User profile',
            profile_user: user,
            populated_user
        });
        
    } catch (error) {
        console.log(`Error: ${error}`);
        return;
    }
    
    // res.end('<h1>User Profile</h1>');
    // return res.render('user_profile',{
    //     title: 'User profile'
    // });
}

module.exports.update = async function(req,res){
//     User.findByIdAndUpdate({_id: req.params.id, user: req.user.id}, req.body)
//     .then(user=>{
//         return res.redirect('back');
//     })
//     .catch(error=>{
//         console.log(`Error in updating the user credientials: ${error}`);
//         return res.status(401).send('Unauthorized');
//     });
// }

if(req.user.id == req.params.id){
    try {
        let user = await User.findById(req.params.id);

        User.uploadedAvatar(req,res,function(err){
            if(err){
                console.log(`*******Multer Error: ${err}`);
                return;
            }
            user.name = req.body.name;
            user.email = req.body.email;

            if(req.file){

                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                }
                //this is saving the path of the uploaded file into the avatar field of the user
                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            return res.redirect('back');
        });

    } catch (error) {
        req.flash('error',error);
        return res.redirect('back');
    }

}else{
    req.flash('error','Unauthorized!');
    return res.status(401).send('Unauthorized');
 }
}

module.exports.edit = function(req,res){
    res.end('<h1>Edit will Display</h1>');
 }



//render the sign in page
module.exports.signIn = function(req,res){
    
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title: 'Codeial | Sign In'
    });
}

//render the sign up page
module.exports.signUp = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title: 'Codeial | Sign Up'
    });
}


//get the sign up data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    // User.findOne({email: req.body.email},function(err,user){
    //     if(err){
    //         console.log(`error in finding the user in the signup: ${err}`);
    //         return;
    //     }

    //     if(!user){
    //         User.create(req.body,function(err,user){
    //             if(err){
    //                 console.log(`error in creating the user while signup: ${err}`);
    //                 return;
    //             }        

    //             return res.redirect('/user/sign-in');
    //         });
    //     }else{
    //         return res.redirect('back');
    //     }
    // });

    User.findOne({email: req.body.email})
     .then(user =>{
        if(!user){
            User.create(req.body)
             .then(() => res.redirect('/users/sign-in'))
             .catch(error =>  console.log(`error in creating the user while signup: ${error}`));
            
        }else{
            return res.redirect('back');
        }
     })

     .catch(error =>{
        console.log(`error in finding the user in the signup: ${error}`);
        return;
     });

    
}


//sign in and create a session for the user
module.exports.createSession = function(req,res){
    req.flash('success','Logged in successfully');
    return res.redirect('/');
}



module.exports.destroySession = function(req,res,next){
    
    req.logout(error =>{
        if(error){
            return next(error);
        }

        
        // req.session.destroy(error => {
        //     if(error){
        //         return next(error);
        //     }
        req.flash('success','You have logged out');
            return res.redirect('/'); 
        // });
    
    });
   
    
}