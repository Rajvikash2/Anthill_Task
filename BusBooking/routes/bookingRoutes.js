const express = require("express");
const { bookBus, cancelBooking } = require("../controllers/bookingController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/book", verifyToken, bookBus);
router.put("/cancel/:bookingId", verifyToken, cancelBooking);

module.exports = router;
