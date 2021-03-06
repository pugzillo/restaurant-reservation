const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const knex = require("../db/connection");

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
 * Checks if the required fields for seating exist
 */
function seatingInputIsValid(req, res, next) {
  if (!req.body.data.reservation_id) {
    const error = new Error("A reservation_id is required");
    error.status = 400;
    return next(error);
  }
  next();
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
  if (typeof capacity !== "number") {
    const error = new Error("capacity is not a number");
    error.status = 400;
    return next(error);
  }
  next();
}

/**
 * Checks if table_id is exists
 */
async function tableIdExists(req, res, next) {
  const tableId = req.params.table_id;
  const table = await service.read(tableId);
  if (!table) {
    const error = new Error(`table id, ${tableId}, does not exist`);
    error.status = 404;
    return next(error);
  }
  res.locals.table = table;
  next();
}

/**
 * Checks if reservation_id exists
 */
async function reservationIdExists(req, res, next) {
  const reservationId = req.body.data.reservation_id;
  if (!reservationId) {
    return next({
      status: 400,
      message: "reservation_id is missing or empty",
    });
  }
  const reservation = await reservationService.read(reservationId);
  if (!reservation) {
    const error = new Error(`reservation_id ${reservationId} does not exist`);
    error.status = 404;
    return next(error);
  }
  res.locals.reservation = reservation; // save reservation to local var
  next();
}

/**
 * Checks if reservation status is seated
 */
function reservationStatusIsSeated(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "seated") {
    const error = new Error(`Reservation is already seated`);
    error.status = 400;
    return next(error);
  }
  next();
}

/**
 * Checks if table has sufficient capacity
 */
function tableHasSufficientCapacity(req, res, next) {
  const partySize = res.locals.reservation.people;
  const table = res.locals.table;
  if (partySize > table.capacity) {
    const error = new Error(
      `Table ${table.table_name} does not have sufficient capacity`
    );
    error.status = 400;
    return next(error);
  }
  next();
}

/**
 * Checks if table is already occupied
 */
function tableIsOccupied(req, res, next) {
  const table = res.locals.table;
  if (table.reservation_id) {
    const error = new Error(`Table ${table.table_name} is occupied.`);
    error.status = 400;
    return next(error);
  }
  next();
}

/**
 * Checks if table is free
 */
function tableIsFree(req, res, next) {
  const table = res.locals.table;
  if (!table.reservation_id) {
    const error = new Error(`Table ${table.table_name} is not occupied.`);
    error.status = 400;
    return next(error);
  }
  next();
}

/**
 * Checks if body data exists
 */
function bodyDataExists(req, res, next) {
  const bodyData = req.body.data;
  if (!bodyData) {
    const error = new Error("Data is missing.");
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

/**
 * Read handler for tables
 */
async function read(req, res) {
  const tableId = req.params.table_id;
  const table = await service.read(tableId);
  res.json({ table });
}

/**
 * Update handler for tables seating; also updates the reservation status using transactions
 */
async function update(req, res, next) {
  const updatedTable = {
    ...res.locals.table,
    reservation_id: req.body.data.reservation_id,
  };
  const updatedReservation = {
    ...res.locals.reservation,
    status: "seated",
  };
  try {
    await knex.transaction(async (trx) => {
      const tableData = await service.update(updatedTable);
      await reservationService.update(updatedReservation);
      res.status(200).json({ tableData });
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Destroy reservation for a table
 */
async function destroyReservation(req, res, next) {
  const reservation_id = res.locals.table.reservation_id;
  const updatedTable = {
    ...res.locals.table,
    reservation_id: null,
  };

  try {
    const tableData = await service.update(updatedTable);
    await reservationService.finishReservation(reservation_id);
    res.status(200).json({ tableData });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    requiredFieldsExist,
    tableNameMoreThanOneCharacter,
    capacityIsANumber,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableIdExists),
    seatingInputIsValid,
    bodyDataExists,
    reservationIdExists,
    reservationStatusIsSeated,
    tableHasSufficientCapacity,
    tableIsOccupied,
    asyncErrorBoundary(update),
  ],
  read: [asyncErrorBoundary(read)],
  destroyReservation: [
    asyncErrorBoundary(tableIdExists),
    tableIsFree,
    asyncErrorBoundary(destroyReservation),
  ],
};
