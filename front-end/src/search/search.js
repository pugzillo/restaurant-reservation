import React, { useState } from "react";
import { listReservations } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
  const history = useHistory();
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [reservationErrors, setReservationErrors] = useState();

  const loadSearchResults = () => {
    const abortController = new AbortController();
    listReservations({ mobile_number: mobileNumber }, abortController.signal)
      .then(setReservations)
      .catch(setReservationErrors);
    return () => abortController.abort();
  };

  const changeHandler = (event) => {
    setMobileNumber(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    history.push(`/search?mobile_number=${mobileNumber}`);
    loadSearchResults();
  };

  return (
    <div className="search">
      <h1>Search</h1>
      {reservationErrors && <ErrorAlert error={reservationErrors} />}

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

      {reservations.length > 0 ? (
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
      ) : (
        "No reservations found"
      )}
    </div>
  );
}

export default Search;
