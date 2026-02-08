import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const base = process.env.DEPLOY_TARGET === 'ghpages' ? '/namjin/' : '/'
export default defineConfig({
  plugins: [react()],
  base,
})
