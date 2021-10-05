import React from "react";

import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import CreateReservationForm from "../reservations/create-reservation-form";
import NewTableForm from "../tables/new-table-form";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationSeating from "../dashboard/ReservationSeating";

/**
 * Retrieves query parameters of a URL via URLSearchParams
 *
 * @returns react hook
 */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  let query = useQuery();
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/tables/new">
        <NewTableForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeating />
      </Route>
      <Route path="/reservations/new">
        <CreateReservationForm />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={query.get("date") ? query.get("date") : today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
