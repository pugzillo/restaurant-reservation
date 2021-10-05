const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Checks if the required fields exist
 */
function requiredFieldsExist(req, res, next) {
  const { data = {} } = req.body;
  const requiredFields = ["table_name", "capacity"];

  try {
    requiredFields.forEach((field) => {
      if (!data[field]) {
        const error = new Error(`A '${field}' field is required`);
        error.status = 400;
        throw error;
      }
    });
    // set local variables for fields that must be validated
    res.locals.tableName = data.table_name;
    res.locals.capacity = data.capacity;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Checks if table_name is more than one character
 */
function tableNameMoreThanOneCharacter(req, res, next) {
  const tableName = res.locals.tableName;
  if (tableName.length === 1) {
    const error = new Error("table_name should be greater than one character.");
    error.status = 400;
    return next(error);
  }
  next();
}

/**
 * Checks if table_name is more than one character
 */
function capacityIsANumber(req, res, next) {
  const capacity = res.locals.capacity;
  if (typeof(capacity) !== "number") {
    const error = new Error("capacity is not a number");
    error.status = 400;
    return next(error);
  }
  next();
}

/**
 * List handler for tables resources
 */
async function list(req, res, next) {
  const data = await service.list();
  res.json({ data });
}

/**
 * Create handler for tables resources
 */
async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    requiredFieldsExist,
    tableNameMoreThanOneCharacter,
    capacityIsANumber,
    asyncErrorBoundary(create),
  ],
};
