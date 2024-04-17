import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import Icons from 'unplugin-icons/vite';

// https://astro.build/config
export default defineConfig({
	output: 'hybrid',
	integrations: [react(), tailwind({ applyBaseStyles: false })],
	vite: {
		plugins: [
			Icons({
				compiler: 'astro',
			}),
		],
	},
	server: {
		port: 4000,
	},
});
