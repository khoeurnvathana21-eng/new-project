// ============================================================
// BootZone - SMS Utility
// File: server/utils/sendSms.js
// Sends SMS via Twilio once TWILIO_* env vars are configured.
// Until then, this is a no-op so the OTP flow falls back to email.
// ============================================================

let twilioClient = null;

const isConfigured = () =>
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_FROM_NUMBER;

export const smsEnabled = () => isConfigured();

export const sendSms = async ({ to, body }) => {
  if (!isConfigured()) return false;

  if (!twilioClient) {
    const { default: twilio } = await import('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  await twilioClient.messages.create({
    to,
    from: process.env.TWILIO_FROM_NUMBER,
    body,
  });
  return true;
};
