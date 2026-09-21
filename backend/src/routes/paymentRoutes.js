/**
 * Payment routes (client checkout module).
 * Mounted from the forum router at `/v1/payments`, so the endpoints are:
 *   POST /api/v1/payments/validate-discount
 *   POST /api/v1/payments/receipt
 */

const express = require("express");

const router = express.Router();

const paymentController = require("../controllers/paymentController");

router.post("/validate-discount", paymentController.validateDiscount);
router.post("/receipt", paymentController.generateReceipt);

module.exports = router;