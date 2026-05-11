import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Logs from "./Logs";
import Dashboard from "./dashboard";
import Contactanos from "./contactanos"
import ServiciosTributarios from "./servicios"
import Capacitacion from "./capacitacion"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Aduanas from "./aduanas";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/logs" element={<Logs />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/contactanos" element= {<Contactanos/>}/>
      <Route path="/servicios" element= {<ServiciosTributarios/>}/>
      <Route path="/capacitacion" element= {<Capacitacion/>}/>
      <Route path="/aduanas" element ={<Aduanas/>}/>
      
    </Routes>
  </BrowserRouter>
);