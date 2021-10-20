import React, { useEffect, useState } from "react";
import {
  listReservations,
  listTables,
  removeReservation,
  updateReservationStatus,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, previous, next } from "../utils/date-time";
import { Link } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationErrors, setReservationErrors] = useState(null);
  const [displayedDate, setdisplayedDate] = useState(date);
  const [tables, setTables] = useState([]);
  const [tablesErrors, setTablesErrors] = useState(null);
  const [tableReservationErrors, setTableReservationErrors] = useState(null);

  useEffect(loadDashboard, [displayedDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    listReservations({ date: displayedDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationErrors);
    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTablesErrors);
    return () => abortController.abort();
  }

  const handleToday = () => {
    setdisplayedDate(today());
  };
  const handleNext = () => {
    setdisplayedDate(next(displayedDate));
  };
  const handlePrevious = () => {
    setdisplayedDate(previous(displayedDate));
  };
  const finishButton = (reservationId, tableId) => {
    if (reservationId) {
      return (
        <button
          type="button"
          className="btn btn-secondary"
          value={tableId}
          data-table-id-finish={tableId}
          onClick={(event) => handleModalFinish(event, reservationId)}
        >
          Finish
        </button>
      );
    }
  };

  const handleModalFinish = (event, reservationId) => {
    if (window.confirm("Is this table ready to seat new guests?")) {
      const abortController = new AbortController();
      removeReservation(
        event.target.value,
        reservationId,
        abortController.signal
      )
        .then(() => updateReservationStatus(reservationId, "finished"))
        .then(() => loadDashboard())
        .catch(setTableReservationErrors);
    }
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={reservationErrors} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {displayedDate}</h4>
      </div>
      <div className="DateControlButtons">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button type="button" className="btn btn-primary" onClick={handleToday}>
          Today
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleNext}
        >
          Next
        </button>
      </div>

      <div className="ReservationsTable">
        <ErrorAlert error={tablesErrors} />
        <ErrorAlert error={tableReservationErrors} />
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Reservation Time</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              return (
                reservation.status !== "finished" && (
                  <tr key={reservation.reservation_id}>
                    <td>{reservation.first_name}</td>
                    <td>{reservation.last_name}</td>
                    <td>{reservation.mobile_number}</td>
                    <td>{reservation.reservation_time}</td>
                    <td data-reservation-id-status={reservation.reservation_id}>
                      {reservation.status}
                    </td>
                    <td>
                      {reservation.status === "booked" && (
                        <Link
                          type="button"
                          className="btn btn-secondary"
                          href={`/reservations/${reservation.reservation_id}/seat`}
                          to={`/reservations/${reservation.reservation_id}/seat`}
                        >
                          Seat
                        </Link>
                      )}
                    </td>
                    <td>
                      <Link
                        type="button"
                        className="btn btn-secondary"
                        href={`/reservations/${reservation.reservation_id}/edit`}
                        to={`/reservations/${reservation.reservation_id}/edit`}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="TablesTable">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Table Name</th>
              <th scope="col">Capacity</th>
              <th scope="col">Seated</th>
              <th scope="col">Finish</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => {
              return (
                <tr key={table.table_id}>
                  <td>{table.table_name}</td>
                  <td>{table.capacity}</td>
                  <td data-table-id-status={table.table_id}>
                    {table.reservation_id ? "occupied" : "free"}
                  </td>
                  <td>{finishButton(table.reservation_id, table.table_id)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
