// Every route was writing its own res.status().json({...}) shape.
// These two helpers make sure every response from this API looks the same.

function successResponse(res, statusCode, message, data) {
  const body = { success: true, message };
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
}

function errorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ success: false, message });
}

module.exports = { successResponse, errorResponse };