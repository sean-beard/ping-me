import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    host: true,
    port: 3000,
  },
  adapter: netlify(),
});
