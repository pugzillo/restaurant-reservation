import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

function NewTableForm() {
  // tracks form state
  const [form, setForm] = useState({
    table_name: "",
    capacity: 0,
  });

  const [formErrors, setFormErrors] = useState([]);

  // Changes form when submitted
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createTable(form)
      .then(() => history.push("/dashboard")) // send users to dashboard page
      .catch((err) => setFormErrors([...formErrors, err.message]));
  };

  const history = useHistory();

  const handleCancel = (event) => {
    history.push("/reservations/new"); // send user to home after canceling
  };

  return (
    <div className="NewTableForm">
      <h1>Create New Table</h1>
      <form onSubmit={handleSubmit}>
        <div className="TableName">
          <label>
            Table Name:
            <input type="text" name="table_name" onChange={changeHandler} />
          </label>
        </div>
        <div className="Capacity">
          <label>
            Capacity:
            <input type="number" name="capacity" onChange={changeHandler} />
          </label>
        </div>
        <div className="FormButtons">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
export default NewTableForm;
