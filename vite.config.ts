import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      'e604ef52dafa.ngrok-free.app', // your ngrok URL here
    ],
  },
});
