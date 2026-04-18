import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Logs from "./Logs";
import Dashboard from "./dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/logs" element={<Logs />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);