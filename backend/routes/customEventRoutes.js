const express = require("express");
const router = express.Router();
const {
  createCustomEvent,
  getCustomEvents,
  getPendingEvents,
  updateEventStatus,
  deleteEvent,
} = require("../controllers/customEventController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/create", upload.single("image"), createCustomEvent);
router.get("/", getCustomEvents);
router.get("/events/pending", getPendingEvents);
router.put("/events/status/:id", updateEventStatus);
router.delete("/events/:id", deleteEvent);

module.exports = router;
