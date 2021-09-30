const knex = require("../db/connection");

// TODO: Change to show the reservations of the current date as the default
function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

module.exports = {
  list,
};
