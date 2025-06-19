const express = require("express");
const router = express.Router();
const {
  createCustomEvent,
  getCustomEvents,
  getPendingEvents,
  updateEventStatus,
} = require("../controllers/customEventController");

router.post("/create", createCustomEvent);
router.get("/", getCustomEvents);
router.get("/events/pending", getPendingEvents);
router.put("/events/status/:id", updateEventStatus);

module.exports = router;
