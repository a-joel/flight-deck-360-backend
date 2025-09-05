const express = require("express");

const Booking = require("../models/ticketBookingSchema");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allTickets = await Booking.find();
    console.log("Tickets fetched");
    return res.status(200).json({ data: allTickets });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get('/:id', async (req, res) => {
        const {id} = req.params;

        try {
                const singleTicketCredentials = await Booking.findById(id);

                if(!singleTicketCredentials) {
                        console.log("Id invalid");
                        return res.status(400).json({message: "Invalid ID"});
                }
                console.log(singleTicketCredentials);
                return res.status(200).json({singleTicketCredentials})
                
        } catch (error) {
                console.log(error);
                return res.status(500).json({error: error.message});          
        }
});

router.post("/book-ticket", async (req, res) => {
  const {
    passengerName,
    contact,
    email,
    flightNumber,
    journeyDate,
    from,
    to,
    totalPassengers,
    assistanceRequired,
  } = req.body;

  try{
        const newBooking = new Booking({
                passengerName,
                contact,
                email,
                flightNumber,
                journeyDate,
                from,
                to,
                totalPassengers,
                assistanceRequired
        });

        await newBooking.save();
        console.log(newBooking);
        return res.status(201).json({data: newBooking});
        
  }catch(error){
        console.log(error);
        return res.status(500).json({error: error.message
        });
        
  }
});

router.put('/update-ticket/:id', async (req, res) => {
        const {id} = req.params;

        try{
                const ticketDetails = await Booking.findById(id);

                if(!ticketDetails){
                        console.log("Ticket data not found");
                        return res.status(400).json({message: "Ticket data not found."})
                }
        
                await Booking.findByIdAndUpdate(id, req.body);
                const updatedTicketDetails = await Booking.findById(id);

                console.log("Ticket details Updated", updatedTicketDetails);
                return res.status(201).json({updatedTicketDetails})
                
        }catch(error){
                console.log(error);
                return res.status(500).json({message: error.message});
                
        }
});

module.exports = router;
