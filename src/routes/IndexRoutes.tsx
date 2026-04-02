import { Home } from "@modules/landing/home";
import { NotFound } from "@modules/authentication/NotFound";

import { Route, Routes } from "react-router-dom";
import { GameIntro } from "@modules/game/GameIntro";

export function IndexRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<Home />} />
        <Route path="/jueguito" element={<GameIntro />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
