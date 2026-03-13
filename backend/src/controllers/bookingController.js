const Booking = require('../models/Booking');
const { success } = require('../utils/responseHelper');
const AppError = require('../utils/AppError');
const { sendCancellationEmail } = require('../services/emailService');

const DEFAULT_USER_ID = 1;

async function getAll(req, res, next) {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const { rows, total } = await Booking.findAllByUser(
      DEFAULT_USER_ID,
      status,
      pageNum,
      limitNum
    );

    const totalPages = Math.ceil(total / limitNum) || 1;
    const start = total === 0 ? 0 : (pageNum - 1) * limitNum + 1;
    const end = Math.min(pageNum * limitNum, total);

    return success(
      res,
      rows,
      'Bookings fetched',
      {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        range: { start, end },
      }
    );
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const { uid } = req.params;
    const { rows } = await Booking.findById(uid);
    const booking = rows[0];
    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }
    return success(res, booking, 'Booking fetched');
  } catch (err) {
    return next(err);
  }
}

async function cancel(req, res, next) {
  try {
    const { uid } = req.params;
    const { rows: existingRows } = await Booking.findById(uid);
    const existing = existingRows[0];
    if (!existing) {
      throw new AppError(404, 'Booking not found');
    }

    const { rows } = await Booking.cancel(uid);
    const updated = rows[0];

    try {
      await sendCancellationEmail(updated);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to send cancellation email:', err.message);
    }

    return success(res, updated, 'Booking cancelled');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAll,
  getOne,
  cancel,
};

