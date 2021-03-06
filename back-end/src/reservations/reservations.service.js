const knex = require("../db/connection");

function list(date, mobile_number) {
  if (date && !mobile_number) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .andWhereNot({ status: "finished" })
      .orderBy("reservation_time");
  } else {
    return search(mobile_number);
  }
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function update(updatedReservation) {
  return knex("reservations")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function finishReservation(reservation_id) {
  return knex("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: "finished" })
    .then((updatedRecords) => updatedRecords[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  create,
  read,
  update,
  finishReservation,
};
