import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:3002',  // Chỉ ra địa chỉ của backend
        changeOrigin: true,               // Thay đổi origin của yêu cầu
        secure: false,                    // Nếu backend sử dụng HTTP thay vì HTTPS
      },
    }
  }
})
