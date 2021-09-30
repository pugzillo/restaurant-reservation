/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function _getCurrentDate() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; // January is 0;
  let yyyy = today.getFullYear();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return `${yyyy}-${mm}-${dd}`;
}

async function list(req, res) {
  let { date } = req.query;

  if (!date) {
    date = _getCurrentDate();
  }
  const data = await service.list(date);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
