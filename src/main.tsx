import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import HomePage from "./pages/HomePage.jsx";
import ComingSoon from "./pages/coming-soon.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<HomePage />} />
        <Route path="/workflow" element={<App />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
