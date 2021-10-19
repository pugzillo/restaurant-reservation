/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves an existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty reservation saved in the database.
 */
export async function getReservation(reservationId, params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Create a reservation.
 * @param reservation
 *  the reservation to create
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a reservation saved in the database.
 */
export async function createReservation(reservation, signal) {
  const data = {
    data: {
      ...reservation,
      people: parseInt(reservation.people),
    },
  };

  const url = new URL(`${API_BASE_URL}/reservations`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Create a table.
 * @param table
 *  the reservation to create
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<[table]>}
 *  a promise that resolves to a table saved in the database.
 */
export async function createTable(table, signal) {
  const data = {
    data: {
      ...table,
      capacity: parseInt(table.capacity),
      status: "Free",
    },
  };

  const url = new URL(`${API_BASE_URL}/tables`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Retrieves all existing tables.
 * @returns {Promise<[tables]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */

export async function listTables(params, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Seats a reservation at a specific table.
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty table object in the database.
 */
export async function seatReservation(reservation_id, table_id, signal) {
  const data = {
    data: {
      reservation_id: reservation_id,
    },
  };

  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Remove a reservation at a specific table.
 * @returns {Promise<[table]>}
 *  a promise that resolves to an empty table without a reservation.
 */
export async function removeReservation(table_id, reservation_id, signal) {
  const data = {
    data: {
      reservation_id: reservation_id,
    },
  };
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Update the status of a particular reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a reservation with an updated status.
 */
export async function updateReservationStatus(reservation_id, status, signal) {
  const data = {
    data: {
      status: status,
    },
  };
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
    signal,
  };
  return await fetchJson(url, options, {});
}
