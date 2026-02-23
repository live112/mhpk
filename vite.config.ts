import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  base: "/mhpk-frontend-react/",
  resolve: {
    alias: {
      "@api": fileURLToPath(new URL("./src/api", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url),
      ),
      "@context": fileURLToPath(new URL("./src/context", import.meta.url)),
      "@layout": fileURLToPath(new URL("./src/layout", import.meta.url)),
      "@modules": fileURLToPath(new URL("./src/modules", import.meta.url)),
      "@routes": fileURLToPath(new URL("./src/routes", import.meta.url)),
      "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
    },
  },
});
