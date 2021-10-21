import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { Message } from "semantic-ui-react";

function ReservationForm({ reservation }) {
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

  useEffect(preFillForm, [reservation]);

  function preFillForm() {
    if (reservation && Object.keys(reservation).length > 0) {
      const {
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
      } = reservation;
      setForm({
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
      });
    }
  }

  return (
    <div className="CreateReservationForm">
      {formErrors.length !== 0 && (
        <Message negative className="alert alert-danger">
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
              id="first_name"
              className="form-control"
              onChange={changeHandler}
              value={form.first_name}
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
              id="last_name"
              className="form-control"
              onChange={changeHandler}
              value={form.last_name}
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
              id="mobile_number"
              className="form-control"
              onChange={changeHandler}
              value={form.mobile_number}
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
              id="reservation_date"
              className="form-control"
              onChange={changeHandler}
              value={form.reservation_date}
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
              id="reservation_time"
              className="form-control"
              onChange={changeHandler}
              value={form.reservation_time}
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
              id="people"
              className="form-control"
              onChange={changeHandler}
              value={form.people}
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

export default ReservationForm;
