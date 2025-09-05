const mongoose = require("mongoose");

const ticketBookingSchema = mongoose.Schema({
  passengerName: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  flightNumber: {
    type: String,
    required: true,
  },
  journeyDate: {
    type: Date,
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
  totalPassengers: {
    type: Number,
    required: true,
    min: 1,
  },
  assistanceRequired: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("booking", ticketBookingSchema);
