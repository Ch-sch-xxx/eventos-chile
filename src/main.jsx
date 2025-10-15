import "bootstrap/dist/css/bootstrap.min.css"; // primero
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// carga tus CSS después de Bootstrap, y solo aquí
import "./css/StyleAuth.css";
import "./css/AdminStyle.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
