module.exports.home = function(req,res){
    // console.log(req.cookies);
    // res.cookie('userId',11);
    return res.render('home',{
        title: 'Home'
    });
}



module.exports.contact = function(req,res){
    return res.end('<h1>Contacts will be display</h1>');
}