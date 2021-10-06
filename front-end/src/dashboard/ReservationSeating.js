import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, getReservation, seatReservation } from "../utils/api";

/**
 * Seat reservations at tables
 */
function ReservationSeating() {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]); // state for the list of tables
  const [tablesError, setTablesError] = useState(null);
  const [reservation, setReservation] = useState({}); // state for the reservation
  const [reservationError, setReservationError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(loadDropDown, [reservation_id]);
  useEffect(loadReservation, [reservation_id]);

  // loads reservation information
  function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    getReservation(reservation_id, {}, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);
    return () => abortController.abort();
  }

  // Loads the dropdown
  function loadDropDown() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  // Changes form when selected
  const changeHandler = (event) => {
    setSelectedTable(event.target.value);
    console.log(selectedTable);
  };

  const history = useHistory();

  // Changes form when submitted
  const submitHandler = (event) => {
    event.preventDefault();
    seatReservation(reservation_id, selectedTable);
    history.push("/dashboard"); // send user to home after canceling
  };

  const handleCancel = (event) => {
    history.push("/dashboard"); // send user to home after canceling
  };

  return (
    <div className="ReservationSeating">
      <h1>Seat a Reservation</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group row">
          <div className="col-auto my-1">
            <h4 className="mb-0">Seat Reservation {reservation_id}</h4>
            <h5>Party of {reservation.people}</h5>
            <select
              className="custom-select mr-sm-2"
              id="inlineFormCustomSelect"
              onChange={changeHandler}
            >
              <option value>Choose...</option>
              {tables.map((table) => {
                return (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - capacity: {table.capacity}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="form-group row">
          <div className="FormButtons">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReservationSeating;
