const nodemailer = require('nodemailer');

let transporterInstance = null;

/**
 * Returns a singleton transporter instance
 */
function getTransporter() {
  if (transporterInstance) return transporterInstance;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('Email service skipped: Missing SMTP environment variables (HOST, PORT, USER, or PASS)');
    return null;
  }

  const transportConfig = {
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    // For Gmail port 587 or 465
    tls: {
      rejectUnauthorized: false
    }
  };

  // Use 'service' shortcut for Gmail as it provides better defaults for ports/tls
  if (SMTP_HOST.includes('gmail.com')) {
    transportConfig.service = 'gmail';
  } else {
    transportConfig.host = SMTP_HOST;
    transportConfig.port = Number(SMTP_PORT);
    transportConfig.secure = Number(SMTP_PORT) === 465;
  }

  transporterInstance = nodemailer.createTransport(transportConfig);
  transporterInstance.fromAddress = SMTP_FROM || SMTP_USER;

  // VERIFY IMMEDIATELY ON STARTUP (This will show up in Render logs)
  console.log('--- SMTP DIAGNOSTIC START ---');
  transporterInstance.verify((error, success) => {
    if (error) {
      console.error('CRITICAL: SMTP Connection Failed:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.log('SUCCESS: SMTP Server is ready to deliver emails');
    }
    console.log('--- SMTP DIAGNOSTIC END ---');
  });

  return transporterInstance;
}

// Initialize immediately so we see the log on server start
getTransporter();

async function sendBookingConfirmation(booking) {
  const tx = getTransporter();
  if (!tx) {
    return;
  }

  const { booker_email, booker_name, start_time, end_time, uid } = booking;

  const subject = `Confirmed: meeting with ${booker_name}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="background: #10B981; width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 20px;">✓</div>
        <h2 style="margin-top: 10px;">Your event has been scheduled</h2>
        <p style="color: #666;">We sent an email to everyone with this information.</p>
      </div>
      <div style="border-top: 1px solid #eee; padding-top: 20px;">
        <p><strong>What</strong><br/>${booking.event_title || 'Meeting'}</p>
        <p><strong>When</strong><br/>${new Date(start_time).toLocaleString()}</p>
        <p><strong>Who</strong><br/>${booker_name} & ${booking.host_name || 'Host'}</p>
        <p><strong>Where</strong><br/>Cal Video</p>
        ${booking.notes ? `<p><strong>Additional notes</strong><br/>${booking.notes}</p>` : ''}
      </div>
      <div style="margin-top: 30px; text-align: center; color: #888; font-size: 12px;">
        Need to make a change? Reschedule or Cancel
      </div>
    </div>
  `;

  console.log(`Sending booking confirmation email to ${booker_email}...`);
  try {
    await tx.sendMail({
      from: tx.fromAddress,
      to: booker_email,
      subject,
      html,
    });
    console.log(`Booking confirmation email sent successfully to ${booker_email}`);
  } catch (error) {
    console.error(`ERROR: Failed to send booking confirmation email to ${booker_email}:`, error.stack || error.message);
    throw error;
  }
}

async function sendCancellationEmail(booking) {
  const tx = getTransporter();
  if (!tx) {
    return;
  }

  const { booker_email, booker_name, start_time, uid } = booking;

  const subject = 'Your booking was cancelled';
  const text = [
    `Hi ${booker_name},`,
    '',
    'Your booking has been cancelled.',
    `Original start: ${start_time}`,
    `Reference: ${uid}`,
  ].join('\n');

  console.log(`Sending cancellation email to ${booker_email}...`);
  try {
    await tx.sendMail({
      from: tx.fromAddress,
      to: booker_email,
      subject,
      text,
    });
    console.log(`Cancellation email sent successfully to ${booker_email}`);
  } catch (error) {
    console.error(`ERROR: Failed to send cancellation email to ${booker_email}:`, error.stack || error.message);
    throw error;
  }
}

module.exports = {
  sendBookingConfirmation,
  sendCancellationEmail,
};

