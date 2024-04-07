import base from '@repo/ui/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
	presets: [base],
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'../../packages/ui/src/components/**/*.{ts,tsx}',
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
