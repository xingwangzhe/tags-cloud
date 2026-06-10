import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "TagsCloud",
      formats: ["es"],
      fileName: () => "index.js",
    },
    sourcemap: true,
  },
});
