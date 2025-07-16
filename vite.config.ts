import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@functions': path.resolve(__dirname, './src/functions'),
			'@mocks': path.resolve(__dirname, './src/mocks'),
			'@utils': path.resolve(__dirname, './src/utils'),
		},
	},
	plugins: [react()],
});
