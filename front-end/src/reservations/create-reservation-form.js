import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { createReservation } from "../utils/api";

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
  const [formError, setFormError] = useState(false);

  // Changes form when submitted
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    createReservation(form)
      .then(() => history.push(`/dashboard?date=${form.reservation_date}`))
      .catch((err) => setFormError(true));
    //
  };

  const cancelLink = "/"; // send user to home after canceling

  return (
    <div className="CreateReservationForm">
      <h1>Create New Reservation</h1>
      <form onSubmit={handleSubmit}>
        <div className="FirstName">
          <label>
            First Name:
            <input type="text" name="first_name" onChange={changeHandler} />
          </label>
        </div>
        <div className="LastName">
          <label>
            Last Name:
            <input type="text" name="last_name" onChange={changeHandler} />
          </label>
        </div>
        <div className="MobileNumber">
          <label>
            Mobile Number:
            <input type="text" name="mobile_number" onChange={changeHandler} />
          </label>
        </div>
        <div className="ReservationDate">
          <label>
            Date of Reservation:
            <input
              type="date"
              name="reservation_date"
              onChange={changeHandler}
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
            />
          </label>
        </div>
        <div className="People">
          <label>
            Number of People in Party:
            <input type="text" name="people" onChange={changeHandler} />
          </label>
        </div>
        <div className="FormButtons">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <Link
            to={cancelLink}
            className="btn btn-secondary"
            href="#"
            role="button"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateReservationForm;
