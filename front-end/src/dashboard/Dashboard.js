import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
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
  const [reservationsError, setReservationsError] = useState(null);
  const [displayedDate, setdisplayedDate] = useState(date);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [displayedDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: displayedDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    setTablesError(null);
    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const handleToday = (event) => {
    setdisplayedDate(today());
  };
  const handleNext = (event) => {
    setdisplayedDate(next(displayedDate));
  };
  const handlePrevious = (event) => {
    setdisplayedDate(previous(displayedDate));
  };
  const finishButton = (status) => {
    if (status === "occupied") {
      return (
        <button
          type="button"
          className="btn btn-secondary"
        >
          Finish
        </button>
      );
    }
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={reservationsError} />
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
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Reservation Time</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              return (
                <tr key={reservation.reservation_id}>
                  <td>{reservation.first_name}</td>
                  <td>{reservation.last_name}</td>
                  <td>{reservation.mobile_number}</td>
                  <td>{reservation.reservation_time}</td>
                  <td>
                    <Link
                      type="button"
                      className="btn btn-secondary"
                      href={`/reservations/${reservation.reservation_id}/seat`}
                      to={`/reservations/${reservation.reservation_id}/seat`}
                    >
                      Seat
                    </Link>
                  </td>
                </tr>
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
                  <td data-table-id-status={table.table_id}>{table.status}</td>
                  <td data-table-id-finish={table.table_id}>{finishButton(table.status)}</td>
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
