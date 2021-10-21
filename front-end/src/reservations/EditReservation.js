import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { getReservation } from "../utils/api";
import { Message } from "semantic-ui-react";

function EditReservation() {
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState({});
  const [getError, setGetError] = useState(null);

  useEffect(readReservation, [reservation_id]);

  function readReservation() {
    const abortController = new AbortController();
    setGetError(null);
    getReservation(reservation_id, {}, abortController.signal)
      .then(setReservation)
      .catch(setGetError);
    return () => abortController.abort();
  }

  return (
    <div>
      <h1>Edit Existing Reservation</h1>
      {getError && (
        <Message negative className="alert alert-danger">
          <Message.Header>Warning:</Message.Header>
          <p>{getError}</p>
        </Message>
      )}
      {console.log(reservation)}
      <ReservationForm reservation={reservation} />
    </div>
  );
}

export default EditReservation;
