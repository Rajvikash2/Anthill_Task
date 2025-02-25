const express = require("express");
const { addBus, getBus } = require("../controllers/busController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add", verifyToken, addBus);
router.get("/", getBus);

module.exports = router;
