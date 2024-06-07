import { defineConfig } from 'astro/config';

import node from "@astrojs/node";
import image from './build/image.js';

export default defineConfig({
  site: "https://short.renoux.dev",
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  integrations: [image()],
  scopedStyleStrategy: "where"
});