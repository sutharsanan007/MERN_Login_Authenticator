const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MongoDb_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDb;