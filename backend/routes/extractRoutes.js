const express = require("express");
const router = express.Router();
const { extractInfo } = require("../controllers/extractController");

router.post("/", extractInfo);

module.exports = router;
