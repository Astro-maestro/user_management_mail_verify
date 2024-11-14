const mongoose = require('mongoose');

async function connectDB() {
    mongoose.connect(process.env.MONGODB_URL).then((res)=>{
        console.log('Database connected successfully!');
    }).catch((err)=>{
        console.log('Error while connecting database: ', err);
        
    })
}

module.exports = connectDB