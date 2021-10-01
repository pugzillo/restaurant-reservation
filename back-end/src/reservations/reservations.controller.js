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
    res.locals.people = data.people; // set people to local variable; will be used in following middleware
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * People is a number
 */
function peopleIsInteger(req, res, next) {
  const { people } = res.locals;
  if (typeof people !== 'number'){
    const error = new Error(`Enter a valid people number`);
    error.status = 400;
    return next(error);
  }
  next();
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
    asyncErrorBoundary(create),
  ],
};
