import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://gringo.bingo",
  output: "static",
  srcDir: "./astro-src",
  integrations: [sitemap()],
});