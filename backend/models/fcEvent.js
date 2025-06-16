// backend/models/Event.js
const mongoose = require("mongoose");

const fcEventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  start_date: { type: String },
  end_date: { type: String },
  location: { type: String },
  url_site: { type: String },
  url_image: { type: String },
});

const fcEvent = mongoose.model("fcEvent", fcEventSchema);
module.exports = fcEvent;
