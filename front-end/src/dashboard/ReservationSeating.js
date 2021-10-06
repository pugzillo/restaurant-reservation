import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listTables, getReservation } from "../utils/api";

function ReservationSeating() {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [reservation, setReservation] = useState({});
  const [reservationError, setReservationError] = useState(null);

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
  const changeHandler = (event) => {};
  // Changes form when submitted
  const submitHandler = (event) => {};
  
  return (
    <div className="ReservationSeating">
      <h1>Seat a Reservation</h1>
      <form>
        <div className="form-group row">
          <div className="col-auto my-1">
            <h4 className="mb-0">Seat Reservation {reservation_id}</h4>
            <h5>Party of {reservation.people}</h5>
            <select
              className="custom-select mr-sm-2"
              id="inlineFormCustomSelect"
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
            <button className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReservationSeating;
