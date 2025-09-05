const express = require('express');
const router = express.Router();
const Flight = require('../models/flightDetailSchema');


router.get('/', async (req, res) => {
        try {
                const allFlights = await Flight.find();

                if(!allFlights) {
                        console.log("No flights right now");
                        return res.status(404).json({message: "No flights"});
                }

                console.log("Flights are fetched");
                return res.status(200).json({data: allFlights});
        } catch (error) {
                console.log(error);
                return res.status(500).json({message: "Server Error"})
                
        }
});

router.get('/:id', async (req, res) => {
        const {id} = req.params;

        try {
                const singleFlightDetails = await Flight.findById(id);

                if(!singleFlightDetails) {
                        console.log("Id invalid");
                        return res.status(400).json({message: "Invalid ID"});
                }
                console.log(singleFlightDetails);
                return res.status(200).json({singleFlightDetails})
                
        } catch (error) {
                console.log(error);
                return res.status(500).json({error: error.message});          
        }
});

router.post("/new-flight", async (req, res) => {
  const newflight = req.body
  try {
    const newFlight = await Flight.insertMany(newflight);

    res.status(201).json({ success: true, data: savedFlight });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 🔹 PUT /api/flights/:id - Update a flight (Admin only)
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const flight = await Flight.findById(id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found." });
    }

    // Update flight with new data
    const updatedFlight = await Flight.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // return updated doc + validate
    );

    return res.status(200).json({
      message: "Flight updated successfully",
       updatedFlight
    });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid flight ID." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Server error." });
  }
});

// 🔹 DELETE /api/flights/:id - Delete a flight (Admin only)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const flight = await Flight.findById(id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found." });
    }

    await Flight.findByIdAndDelete(id);

    return res.status(200).json({
      message: `Flight ${flight.flightNumber} deleted successfully.`
    });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid flight ID." });
    }
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;