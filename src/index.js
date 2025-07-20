import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "react-virtualized/styles.css";
// import "antd-mobile/dist/antd-mobile.css"
import "@/assets/fonts/iconfont.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
