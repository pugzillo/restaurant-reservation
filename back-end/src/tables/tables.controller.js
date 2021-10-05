const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

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
  console.log(data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
