import { Routes, Route } from "react-router-dom";

import React from "react";
import Home from "../pages/home";

function Router() {
  return (
    <Routes>
      <Route index element={<Home />} />
    </Routes>
  );
}

export default Router;
