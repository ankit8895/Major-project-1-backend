const mongoose = require('mongoose');
const env = require('./environment');



async function main(){
    await mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
}



main().catch(err => console.log(`Error in connecting with database: ${err}`));
main().then(()=> console.log('Successfully connected with the database'));