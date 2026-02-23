import { Home } from "@modules/landing/home";
import { NotFound } from "@modules/authentication/NotFound";

import { Route, Routes } from "react-router-dom";

export function IndexRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<Home />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
