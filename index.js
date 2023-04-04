const express = require('express');
const env = require('./config/environment');
// const morgan = require('morgan');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const port = 8000;
const app = express();
require('./config/view-helpers')(app);

const expressLayout = require('express-ejs-layouts');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const db = require('./config/mongoose');
const { default: mongoose } = require('mongoose');
const { options } = require('./routes');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening at port: 5000');

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


app.use(express.static(env.asset_path));

//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));


//extract styles and scripts from the sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts',true);

app.use(expressLayout);


app.set('view engine','ejs');
app.set('views','./views');


app.use(session({
    name: 'codeial',
    //TODO change the secret before deployement in the production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: MongoStore.create(
        {
            mongoUrl: `mongodb://127.0.0.1:27017/${env.db}`,
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


app.use(flash());

app.use(customMware.setFlash);


//use express router
// app.use('/',require('./routes/index'));
app.use('/',require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log(`Error is running on server: ${err}`);
    }

    console.log(`server is running on port: ${port}`);
});