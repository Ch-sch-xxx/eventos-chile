import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ProteccionPaginas } from "./util/ProteccionPaginas"; // <-- import actualizado

// Inicializa protección ANTES de renderizar la app
ProteccionPaginas();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
