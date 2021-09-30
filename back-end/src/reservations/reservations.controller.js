/**
 * List handler for reservation resources
 */

// TODO: need to figure out how to make today's date as default for dashboard
// import { today } from "../../../front-end/src/utils/date-time";

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function list(req, res) {
  let { date } = req.query;

  // if (!date) {
  //   date = today();
  // }
  const data = await service.list(date);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
