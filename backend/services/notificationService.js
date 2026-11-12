const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Configure SendGrid API Key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Configure Twilio Client
let twilioClient;

// Function to send a test email via SendGrid
async function sendTestEmail(toEmail) {
  const msg = {
    to: toEmail,
    from: process.env.FROM_EMAIL,
    subject: 'Live Demo Test Email',
    text: "Janadeep's SendGrid email test notification.",
  };
  return sgMail.send(msg);
}

// Function to send a test SMS via Twilio
async function sendTestSMS(toPhone) {
  if (!twilioClient) {
    twilioClient = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return twilioClient.messages.create({
    body: "Janadeep's Twilio SMS notification.",
    from: process.env.TWILIO_PHONE_NUM,
    to: toPhone
  });
}

// Export the functions for use in other files
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

async function sendEmail({ to, subject, text, html }) {
  if (!to) throw new Error('Recipient email is required');
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
    return { ok: true, dev: true };
  }
  return sgMail.send({ to, from: process.env.FROM_EMAIL, subject, text, ...(html ? { html } : {}) });
}

function enrollmentConfirmationEmail({ name, courseName }) {
  return {
    subject: `Enrollment Confirmed - ${courseName}`,
    text: `Hello ${name}, your enrollment in ${courseName} has been confirmed.`,
    html: `<h2>Enrollment Confirmed</h2><p>Hello ${escapeHtml(name)}, your enrollment in ${escapeHtml(courseName)} has been confirmed.</p>`,
  };
}

function certificateEmail({ name, courseName, certificateId, certificateUrl }) {
  return {
    subject: `Certificate Issued - ${courseName}`,
    text: `Hello ${name}, your certificate for ${courseName} has been issued. Certificate ID: ${certificateId}. Certificate: ${certificateUrl}`,
    html: `<h2>Congratulations, ${escapeHtml(name)}!</h2><p>Your certificate for ${escapeHtml(courseName)} has been issued.</p><p>Certificate ID: ${escapeHtml(certificateId)}</p><p><a href="${escapeHtml(certificateUrl)}">Download Certificate</a></p>`,
  };
}

const sendEnrollmentConfirmationEmail = ({ to, ...details }) =>
  sendEmail({ to, ...enrollmentConfirmationEmail(details) });
const sendCertificateEmail = ({ to, ...details }) =>
  sendEmail({ to, ...certificateEmail(details) });

module.exports = {
  sendTestEmail, sendTestSMS, sendEmail, enrollmentConfirmationEmail,
  certificateEmail, sendEnrollmentConfirmationEmail, sendCertificateEmail,
};
