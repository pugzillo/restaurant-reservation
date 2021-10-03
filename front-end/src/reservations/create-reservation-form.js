import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { Message } from "semantic-ui-react";
// import MessageBanner from "./message-banner";

function CreateReservationForm() {
  // tracks form state
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  // error state
  const [formErrors, setFormErrors] = useState([]);

  // Changes form when submitted
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    createReservation(form)
      .then(() => history.push(`/dashboard?date=${form.reservation_date}`))
      .catch((err) => setFormErrors([...formErrors, err.message]));
  };

  const handleCancel = (event) => {
    history.push("/dashboard"); // send user to home after canceling
  };

  return (
    <div className="CreateReservationForm">
      <h1>Create New Reservation</h1>
      {formErrors.length !== 0 && (
        <Message negative>
          <Message.Header>Warning:</Message.Header>
          <p>{formErrors}</p>
        </Message>
      )}
      <form onSubmit={handleSubmit}>
        <div className="FirstName">
          <label>
            First Name:
            <input
              type="text"
              name="first_name"
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div className="LastName">
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div className="MobileNumber">
          <label>
            Mobile Number:
            <input
              type="text"
              name="mobile_number"
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div className="ReservationDate">
          <label>
            Date of Reservation:
            <input
              type="date"
              name="reservation_date"
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div className="ReservationTime">
          <label>
            Time of reservation:
            <input
              type="time"
              name="reservation_time"
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div className="People">
          <label>
            Number of People in Party:
            <input
              type="number"
              name="people"
              onChange={changeHandler}
              required
            />
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

export default CreateReservationForm;
