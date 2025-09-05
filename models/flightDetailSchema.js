const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },
    flightName: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: String, // e.g., "2h 30m"
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    economySeats: {
      type: Number,
      default: 0,
    },
    businessSeats: {
      type: Number,
      default: 0,
    },
    firstClassSeats: {
      type: Number,
      default: 0,
    },

    // 🎟 Ticket Prices
    ticketPrice: {
      economy: { type: Number, required: true },
      business: { type: Number, required: true },
      firstClass: { type: Number, default: 0 },
    },
    currency: {
      type: String,
      default: "INR",
    },

    // 🍴 Amenities
    freeMeal: {
      type: Boolean,
      default: false,
    },
    mealOptions: {
      type: [String], // ["Veg", "Non-Veg", "Vegan"]
      default: [],
    },
    luggageAllowance: {
      cabin: { type: Number, default: 7 }, // kg
      checkIn: { type: Number, default: 15 }, // kg
    },
    wifiAvailable: {
      type: Boolean,
      default: false,
    },
    entertainmentAvailable: {
      type: Boolean,
      default: false,
    },

    // 🛫 Booking Info
    status: {
      type: String,
      enum: ["Scheduled", "Delayed", "Cancelled"],
      default: "Scheduled",
    },
    refundable: {
      type: Boolean,
      default: true,
    },
    cancellationPolicy: {
      type: String,
      default: "Refundable if cancelled 24 hours before departure",
    },

    // 🕒 Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model('Flight', flightSchema);