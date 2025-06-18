const express = require("express");
const router = express.Router();
const {
  createCustomEvent,
  getCustomEvents,
} = require("../controllers/customEventController");

router.post("/create", createCustomEvent);
router.get("/", getCustomEvents);

module.exports = router;
