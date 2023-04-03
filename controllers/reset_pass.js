const User = require('../models/user');
const AccessToken = require('../models/accessToken');
const crypto = require('crypto');
const resetPasswordMailer = require('../mailers/reset_pass_mailer');



module.exports.home = function(req,res){
    return res.render('verify_email',{
        title: 'Verify your Email Id'
    });
}



module.exports.verifyEmail = async function(req,res){

   let user = await User.findOne({email: req.body.email})


   if(user){

    let token = crypto.randomBytes(20).toString('hex');

    let accessToken = await AccessToken.create({
        user: user,
        token: token,
        isValid: true

    });

    resetPasswordMailer.resetPassword(accessToken);

    return res.render('account_verified',{
        title: 'Account Verified'
    });

   }else{
    req.flash('error','Account does not exits');
    return res.redirect('back');
   }

}



module.exports.reset = async function(req,res){
    let accessToken = await AccessToken.findOne({token: req.query.accessToken});

    if(accessToken){

        if(accessToken.isValid){

            accessToken.isValid = false;
        }

        if(req.body.password == req.body.confirm_password){

            let user = await User.findById(accessToken.user);

            if(user){

                user.password = req.body.password;
                user.confirm_password = req.body.confirm_password;
                accessToken.save();
                user.save();
                req.flash('success','Password Changed');
                return res.redirect('/users/sign-in');
            }
         }else{
                req.flash('error','Password didn`t matched');
                return res.redirect('back');
            }
        }else{
            req.flash('error','Token is expired ! please regenerate it');
            return res.redirect('/reset-password');
        }
    }


module.exports.resetPassword = async function(req,res){
    let accessToken = await AccessToken.findOne({token: req.params.accessToken});

    console.log('Inside resetPassword');

    if(accessToken){
        if(accessToken.isValid){
            return res.render('reset_password_page',{
                title: 'Codeial | Reset Password',
                accessToken: accessToken.token
            });
        }
    }else{
        req.flash('error','Token is Expired ! Please regenerate it');
        return res.redirect('/reset-password');
    }
}
