import React from "react";
import { Route, Redirect } from "react-router-dom";
import { hasToken } from "utils";

const withAuth = (Component) => {
  const Wrapper = (props) => {
    // const isAuthenticated = ;
    return hasToken ? (
      <Component {...props} />
    ) : (
      <Redirect to={{ pathname: "/login", state: { form: props.location } }} />
    );
  };
  return Wrapper;
};

export default withAuth;
