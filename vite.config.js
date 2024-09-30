import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    // host: '192.168.8.14', //for testing mobile version using MiFi
    // host: '192.168.1.115', //for testing mobile version Home WiFi
    port:3000,
    proxy:{
      '/api':{
        // target:'http://192.168.8.14:8000',
        // target:'http://localhost:8000',
        target:'https://ims-backend.up.railway.app:8080',
        changeOrigin: true,
      },
    },
  }
})
