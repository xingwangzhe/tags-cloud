import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    minify: true,
    outDir: "out",
    rollupOptions: {
      input: "index.html",
    },
    sourcemap: false,
  },
  publicDir: false,
});
