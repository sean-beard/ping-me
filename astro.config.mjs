import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    host: true,
    port: 3000,
  },
});
