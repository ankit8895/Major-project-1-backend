const express = require('express');
const cookieParser = require('cookie-parser');
const port = 8000;
const app = express();
const expressLayout = require('express-ejs-layouts');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const db = require('./config/mongoose');
const { default: mongoose } = require('mongoose');
const { options } = require('./routes');
const MongoStore = require('connect-mongo');

app.use(express.urlencoded());
app.use(cookieParser());


app.use(express.static('./assets'));


//extract styles and scripts from the sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts',true);

app.use(expressLayout);


app.set('view engine','ejs');
app.set('views','./views');


app.use(session({
    name: 'codeial',
    //TODO change the secret before deployement in the production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://127.0.0.1:27017/codeial_development',
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    
    )
       
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


//use express router
// app.use('/',require('./routes/index'));
app.use('/',require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log(`Error is running on server: ${err}`);
    }

    console.log(`server is running on port: ${port}`);
});