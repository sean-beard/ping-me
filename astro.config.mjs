import { defineConfig } from "astro/config";

import node from "@astrojs/node";
import htmx from "astro-htmx";

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
  integrations: [htmx()],
});
