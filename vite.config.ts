import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 8000,
        proxy: {
            // "/api": {
            //     target: "localhost:5001",
            //     changeOrigin: true,
            // },
            "/api": {
                target: "http://jsonplaceholder.typicode.com",
                changeOrigin: true,
                rewrite: (path) =>
                    path.replace(/^\/api/, "")
                        .replace("limit", "_limit")
                        .replace("start", "_start"),
            },
        },
    },
})
