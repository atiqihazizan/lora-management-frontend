import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";
import path from "path";
import { fileURLToPath } from "url";

// Konversi import.meta.url ke path menggunakan fileURLToPath
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), commonjs()],
  resolve: {
    alias: {
      "leaflet/dist/images": path.resolve(
        __dirname,
        "node_modules/leaflet/dist/images"
      ),
      // "leaflet-draw": path.resolve(
      //   __dirname,
      //   "node_modules/leaflet-draw/dist/leaflet.draw.js"
      // ),
    },
  },
  // resolve: {
  //   alias: {
  //     "react-dnd": "react-dnd/dist/esm",
  //     "react-dnd-html5-backend": "react-dnd-html5-backend/dist/esm",
  //   },
  // },
  // esbuild: {
  //   loader: "jsx",
  // },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     loader: {
  //       ".js": "jsx",
  //     },
  //   },
  // },
  build: {
    outDir: "../../back-end/nodejs/public",
    emptyOutDir: true,
    // chunkSizeWarningLimit: 100,
    rollupOptions: {
      output: {
        manualChunks: {
          // Pisahkan dependensi pihak ketiga ke dalam chunk `vendor`
          vendor6: ["mqtt"],
          vendor5: ["leaflet"],
          vendor4: ["@geoman-io/leaflet-geoman-free", "geojson-validation"],
          vendor3: ["react-leaflet-google-v2"],
          vendor2: [
            "leaflet-draw",
            "leaflet-geometryutil",
            "leaflet-routing-machine",
          ],
          vendor1: ["react-dom", "react-router", "react-router-dom"],
          vendor: [
            "lodash",
            "axios",
            "@tanstack/react-query",
            "axios",
            "react-dnd",
            "react-dnd-html5-backend",
            "react-dnd-touch-backend",
            "@heroicons/react",
            "@fortawesome/fontawesome-free",
            "react-icons",
          ],
        },
      },
    },
  },
});
