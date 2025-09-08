const express = require('express');
const cors = require('cors');
require('dotenv').config();

const dbConnection = require('./config/dbconnection');
const userRoute = require('./routes/userRoute');
const ticketBookingRoute = require('./routes/ticketBookingRoute');
const flightRoute = require('./routes/flightDetailRoute');
const authMiddleware = require('./controllers/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/booking', ticketBookingRoute);
app.use('/api/flights', flightRoute);

dbConnection();

app.get('/', (req, res) => {
        return res.send({message: "Welcome"});
});

app.listen(process.env.PORT, () => {
        console.log(`Server running http://localhost:${process.env.PORT}`);
});