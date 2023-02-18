import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  server: {
    proxy: {
      "/socket.io": {
        target: "ws://127.0.0.1:80",
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    },
    port: 3000,
  },
  build: {
    manifest: true,
  },
  plugins: [react(), basicSsl()],
})
