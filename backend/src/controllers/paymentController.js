/**
 * Client checkout payment endpoints.
 *
 *   POST /api/v1/payments/validate-discount  -> validates a discount code
 *   POST /api/v1/payments/receipt            -> renders the client receipt email
 *
 * The discount validation enforces the client-mandated cost-center format
 * ("XX-0000") and the commission table rules (expiry, maxUses, department).
 */

const discountService = require("../services/payments/discountService");
const receiptService = require("../services/payments/receiptService");

function validateDiscount(req, res) {
    const { code, costCenter, department, amount } = req.body || {};

    if (!code) {
        return res.status(400).json({ success: false, message: "Discount code is required" });
    }

    const result = discountService.validateDiscount({ code, costCenter, department, amount });

    if (!result.valid) {
        const statusCode = result.status === "unknown" ? 404 : 400;
        return res.status(statusCode).json({ success: false, status: result.status, message: result.message });
    }

    res.status(200).json({ success: true, data: result });
}

function generateReceipt(req, res) {
    const { orderId, enrollmentId, courseTitle, costCenter, discountCode, discountValue, amount, currency, paidAt } =
        req.body || {};

    if (!costCenter || !discountService.isValidCostCenter(costCenter)) {
        return res.status(400).json({ success: false, message: discountService.COST_CENTER_FORMAT_MESSAGE });
    }
    if (!orderId || !courseTitle) {
        return res.status(400).json({ success: false, message: "orderId and courseTitle are required" });
    }

    const rendered = receiptService.renderReceipt({
        orderId,
        enrollmentId,
        courseTitle,
        costCenter,
        discountCode,
        discountValue,
        amount,
        currency,
        paidAt
    });

    res.status(200).json({
        success: true,
        data: {
            templatePath: rendered.templatePath,
            supportEmail: rendered.supportEmail,
            receiptHtml: rendered.html,
            context: rendered.context
        }
    });
}

module.exports = { validateDiscount, generateReceipt };