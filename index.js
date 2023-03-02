const express = require('express');
const port = 8000;
const app = express();
const expressLayout = require('express-ejs-layouts');

const db = require('./config/mongoose');


app.use(express.static('./assets'));


//extract styles and scripts from the sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts',true);

app.use(expressLayout);
//use express router
// app.use('/',require('./routes/index'));
app.use('/',require('./routes'));

app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){
    if(err){
        console.log(`Error is running on server: ${err}`);
    }

    console.log(`server is running on port: ${port}`);
});