import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  listTables,
  getReservation,
  seatReservation,
  updateReservationStatus,
} from "../utils/api";
import { Message } from "semantic-ui-react";

/**
 * Seat reservations at tables
 */
function ReservationSeating() {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]); // state for the list of tables
  const [reservation, setReservation] = useState({}); // state for the reservation
  const [tableErrors, setTableErrors] = useState([]);
  const [reservationErrors, setReservationErrors] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(loadReservation, [reservation_id]);
  useEffect(loadDropDown, [reservation_id]);

  // loads reservation information
  function loadReservation() {
    const abortController = new AbortController();
    getReservation(reservation_id, {}, abortController.signal)
      .then(setReservation)
      .catch(setReservationErrors);
    return () => abortController.abort();
  }

  // Loads the dropdown
  function loadDropDown() {
    const abortController = new AbortController();
    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTableErrors);
    return () => abortController.abort();
  }

  // Changes form when selected
  const changeHandler = (event) => {
    const tableInfo = event.target.value.split(" - ");
    const currentTable = tables.find(
      (table) => table.table_name === tableInfo[0]
    );
    setSelectedTable(currentTable);
  };

  const history = useHistory();

  // Changes form when submitted
  const submitHandler = (event) => {
    event.preventDefault();
    seatReservation(reservation_id, selectedTable.table_id)
      .then(() => updateReservationStatus(reservation_id, "seated"))
      .then(() => history.push("/dashboard"))
      .catch(setReservationErrors);
  };

  const handleCancel = (event) => {
    history.push("/reservations/new"); // send user to home after canceling
  };

  return (
    <div className="ReservationSeating">
      <h1>Seat a Reservation</h1>
      {reservationErrors.length !== 0 && (
        <Message negative className="alert alert-danger">
          <Message.Header>Warning:</Message.Header>
          <ul>
            {reservationErrors.map((err) => {
              return <li>{err}</li>;
            })}
          </ul>
        </Message>
      )}
      {tableErrors.length !== 0 && (
        <Message negative className="alert alert-danger">
          <Message.Header>Warning:</Message.Header>
          <ul>
            {tableErrors.map((err) => {
              return <li>{err}</li>;
            })}
          </ul>
        </Message>
      )}
      <form onSubmit={submitHandler}>
        <div className="form-group row">
          <div className="col-auto my-1">
            <h4 className="mb-0">Seat Reservation {reservation_id}</h4>
            <h5>Party of {reservation.people}</h5>
            <select
              className="custom-select mr-sm-2"
              id="inlineFormCustomSelect"
              name="table_id"
              onChange={changeHandler}
            >
              <option value>Choose...</option>
              {tables.map((table) => {
                return (
                  <option key={table.table_id} name={table.table_id}>
                    {table.table_name} - {table.capacity}
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
