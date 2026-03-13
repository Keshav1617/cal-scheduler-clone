const nodemailer = require('nodemailer');

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    // eslint-disable-next-line no-console
    console.warn('Email service skipped: Missing SMTP environment variables (HOST, PORT, USER, or PASS)');
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    // For Gmail port 587
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.fromAddress = SMTP_FROM || SMTP_USER;

  // Verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP Connection Error:', error);
    } else {
      console.log('SMTP Server is ready to take our messages');
    }
  });

  return transporter;
}

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

