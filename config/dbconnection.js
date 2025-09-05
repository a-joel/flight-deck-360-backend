const mongoose = require('mongoose');
require('dotenv').config();
const dbConnection = async () => {
        try {
                await mongoose.connect(process.env.MONGO_DB_URI);
                console.log("Flight Deck 360 Database Connected");
        } catch(error) {
                console.log(error);
        }
}

module.exports = dbConnection;