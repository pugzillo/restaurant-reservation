import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, getReservation, seatReservation } from "../utils/api";
import { Message } from "semantic-ui-react";

/**
 * Seat reservations at tables
 */
function ReservationSeating() {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]); // state for the list of tables
  const [reservation, setReservation] = useState({}); // state for the reservation
  const [formErrors, setFormErrors] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(loadReservation, [reservation_id]);
  useEffect(loadDropDown, [reservation_id]);

  // loads reservation information
  function loadReservation() {
    const abortController = new AbortController();
    setFormErrors([]);
    getReservation(reservation_id, {}, abortController.signal)
      .then(setReservation)
      .catch((err) => setFormErrors([...formErrors, err.message]));
    return () => abortController.abort();
  }

  // Loads the dropdown
  function loadDropDown() {
    const abortController = new AbortController();
    setFormErrors([]);
    listTables({}, abortController.signal)
      .then(setTables)
      .catch((err) => setFormErrors([...formErrors, err.message]));
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
    setFormErrors([]);
    seatReservation(reservation_id, selectedTable.table_id)
    .then(() => history.push("/dashboard"))
    .catch((err) => setFormErrors([...formErrors, err.message]));
    // if (
    //   selectedTable.capacity >= reservation.people &&
    //   selectedTable.status !== "occupied"
    // ) {
    //   seatReservation(reservation_id, selectedTable.table_id)
    //     .then(() => history.push("/dashboard"))
    //     .catch((err) => setFormErrors([...formErrors, err.message]));
    // } else {
    //   setFormErrors([
    //     ...formErrors,
    //     "Selected table does not have the capacity for this reservation.",
    //   ]);
    // }
  };

  const handleCancel = (event) => {
    history.push("/reservations/new"); // send user to home after canceling
  };

  return (
    <div className="ReservationSeating">
      <h1>Seat a Reservation</h1>
      {formErrors.length !== 0 && (
        <Message negative className="alert alert-danger">
          <Message.Header>Warning:</Message.Header>
          <ul>
            {formErrors.map((err) => {
              return <li>{err}</li>;
            })}
          </ul>
        </Message>
      )}
      {console.log(formErrors)}
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
