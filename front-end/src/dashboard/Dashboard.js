import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, previous, next } from "../utils/date-time";

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

  useEffect(loadDashboard, [displayedDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: displayedDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
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
          class="btn btn-secondary"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button type="button" class="btn btn-primary" onClick={handleToday}>
          Today
        </button>
        <button type="button" class="btn btn-secondary" onClick={handleNext}>
          Next
        </button>
      </div>

      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Reservation Time</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => {
            return (
              <tr>
                <td>{reservation.first_name}</td>
                <td>{reservation.last_name}</td>
                <td>{reservation.mobile_number}</td>
                <td>{reservation.reservation_time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}

export default Dashboard;
