const User = require('../models/user');

module.exports.profile = function(req,res){
    // res.end('<h1>User Profile</h1>');
    return res.render('user_profile',{
        title: 'User profile'
    });
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
module.exports.createSession = function(res,res){
    return res.redirect('/');
}



module.exports.destroySession = function(req,res){
    req.logout(error =>{
        if(error){
            return next(error);
        }

        req.session.destroy(error => {
            if(error){
                return next(error);
            }
           return res.redirect('/');
        });
    });
    
}