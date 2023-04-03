const nodeMailer = require('../config/nodemailer');







module.exports.resetPassword = (accessToken) =>{

    let htmlString = nodeMailer.renderTemplate({accessToken: accessToken},'/resetPassword/reset_password.ejs');

    nodeMailer.transporter.sendMail({
        from: 'temp.tempfortesting@gmail.com',
        to: accessToken.user.email,
        subject: 'Reset Password',
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log(`Error in sending reset link: ${err}`);
            return;
        }

        return;
    });
}