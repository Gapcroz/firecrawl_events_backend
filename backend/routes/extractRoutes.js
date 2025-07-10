const express = require("express");
const router = express.Router();
const {
  extractInfo,
  getAllEvents,
} = require("../controllers/extractController");

router.get("/", extractInfo);
router.get("/", getAllEvents);

module.exports = router;
