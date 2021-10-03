/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Checks if the required fields exist in request body.
 */
function requiredReservationFieldsExist(req, res, next) {
  const { data = {} } = req.body;
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  try {
    requiredFields.forEach((field) => {
      if (!data[field]) {
        const error = new Error(`A '${field}' field is required`);
        error.status = 400;
        throw error;
      }
    });
    // set local variables for fields that must be validated
    res.locals.people = data.people;
    res.locals.reservationDate = data.reservation_date;
    res.locals.reservationTime = data.reservation_time;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * People is a number
 */
function peopleIsInteger(req, res, next) {
  const people = res.locals.people;
  if (typeof people !== "number") {
    const error = new Error("Enter a valid people number");
    error.status = 400;
    return next(error);
  }
  next();
}

/**
 * Checks if reservation_date is a date
 */
function reservationDateIsDate(req, res, next) {
  const reservationDate = res.locals.reservationDate;
  if (isNaN(Date.parse(reservationDate))) {
    const error = new Error("Enter a valid reservation_date");
    error.status = 400;
    return next(error);
  }
  next();
}

/**
 * Checks if reservation_time is a time
 */
function reservationTimeIsTime(req, res, next) {
  const reservationTime = res.locals.reservationTime;
  if (
    /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(reservationTime)
  ) {
    return next();
  }
  const error = new Error("Enter a valid reservation_time");
  error.status = 400;
  next(error);
}

async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    requiredReservationFieldsExist,
    peopleIsInteger,
    reservationDateIsDate,
    reservationTimeIsTime,
    asyncErrorBoundary(create),
  ],
};
