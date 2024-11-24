// @ts-check
import { defineConfig } from 'astro/config';
import zeabur from '@zeabur/astro-adapter/serverless';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  output: 'server',
  adapter: zeabur(),
});