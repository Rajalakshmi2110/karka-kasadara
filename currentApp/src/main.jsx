import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // Make sure this file exists
import "./styles/index.css"
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter> {/* ✅ Wrap everything inside this single Router */}
    <App />
  </BrowserRouter>
);
