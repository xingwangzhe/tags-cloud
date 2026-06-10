import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  base: "./",
  build: {
    outDir: "out",
    minify: true,
    sourcemap: false,
    rollupOptions: {
      input: "index.html",
    },
  },
});
