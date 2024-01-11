/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    // use global to avoid globals imports (describe, test, expect)
    // globals: true,
  },
});
