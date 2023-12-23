import { defineConfig } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    host: true,
    port: 3000,
  },
  adapter: node({
    mode: "standalone",
  }),
});
