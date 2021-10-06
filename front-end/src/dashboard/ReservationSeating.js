import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listTables } from "../utils/api";

function ReservationSeating() {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDropDown, [reservation_id]);

  function loadDropDown() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <div className="ReservationSeating">
      <h1>Seat a Reservation</h1>
      <form>
        <div className="form-group row">
          <div className="col-auto my-1">
            <h4 className="mb-0">Seat Reservation {reservation_id}</h4>
            <select
              className="custom-select mr-sm-2"
              id="inlineFormCustomSelect"
            >
              <option value>Choose...</option>
              {tables.map((table) => {
                return (
                  <option value={table.table_id}>{table.table_name} - capacity: {table.capacity}</option>
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
