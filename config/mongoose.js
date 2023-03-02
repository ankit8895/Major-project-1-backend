const mongoose = require('mongoose');



async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/codeial_development');
}



main().catch(err => console.log(`Error in connecting with database: ${err}`));
main().then(()=> console.log('Successfully connected with the database'));