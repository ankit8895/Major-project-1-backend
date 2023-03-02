module.exports.profile = function(req,res){
    // res.end('<h1>User Profile</h1>');
    return res.render('user_profile',{
        title: 'User profile'
    });
}


module.exports.edit = function(req,res){
    res.end('<h1>Edit will Display</h1>');
}