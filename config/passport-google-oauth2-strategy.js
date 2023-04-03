const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');


//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_callback_url
   },
   function(accessToken,refreshToken,profile,done){

    //find the user


    User.findOne({email: profile.emails[0].value}).exec()

    .then(user =>{

        
        console.log(profile);

        if(user){

            //if found, set this user as req.user
            return done(null,user);
        }else{

            //if not found, create a user and set it as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            })
            .then(user =>{
                return done(null,user);
            })
            .catch(err =>{
                console.log(`error in creating user google startegy-passport: ${err}`);
                retrun;
            });
        }

    })
    .catch(error=>{
        console.log(`error in google strategy-passport: ${err}`);
            return;
    });














    //  User.findOne({email: profile.emails[0].value}).exec(function(err,user){
    //     if(err){
    //         console.log(`error in google strategy-passport: ${err}`);
    //         return;
    //     }

    //     console.log(profile);

    //     if(user){

    //         //if found, set this user as req.user
    //         return done(null,user);
    //     }else{

    //         //if not found, create a user and set it as req.user
    //         User.create({
    //             name: profile.displayName,
    //             email: profile.emails[0].value,
    //             password: crypto.randomBytes(20).toString('hex')
    //         })
    //         .then(user =>{
    //             return done(null,user);
    //         })
    //         .catch(err =>{
    //             console.log(`error in creating user google startegy-passport: ${err}`);
    //             retrun;
    //         });
    //     }
    //  });
   }
));



module.exports = passport;