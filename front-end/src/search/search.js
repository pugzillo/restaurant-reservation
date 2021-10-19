import React, { useState, useEffect } from "react";
import { listReservations } from "../utils/api";

function Search() {
  const [mobileNumber, setMobileNumber] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationErrors, setReservationErrors] = useState(null);

  const loadSearchResults = () => {
    const abortController = new AbortController();
    listReservations({ mobile_number: mobileNumber }, abortController.signal)
      .then(setReservations)
      .catch(setReservationErrors);
    return () => abortController.abort();
  };

  useEffect(loadSearchResults, [mobileNumber]);

  const changeHandler = (event) => {
    setMobileNumber(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="search">
      <h1>Search</h1>

      <form onSubmit={submitHandler}>
        <div className="form-group">
          <input
            type="text"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            className="form-control"
            onChange={changeHandler}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </form>

      <div className="SearchResults">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Reservation Date</th>
              <th scope="col">Reservation Time</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              return (
                <tr key={reservation.reservation_id}>
                  <td>{reservation.first_name}</td>
                  <td>{reservation.last_name}</td>
                  <td>{reservation.mobile_number}</td>
                  <td>{reservation.reservation_date}</td>
                  <td>{reservation.reservation_time}</td>
                  <td data-reservation-id-status={reservation.reservation_id}>
                    {reservation.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Search;
