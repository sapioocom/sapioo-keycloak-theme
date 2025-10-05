// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

export default defineConfig({
    plugins: [
        react(),
        keycloakify({ accountThemeImplementation: "none" })
    ],
    server: {
        proxy: {
            // Frontend → /api/whitelabel/{id}
            // Proxy → https://panda1-api.sapioo.com/accounts/customer-portal/whitelabel/{id}
            "/api/whitelabel": {
                target: "https://panda1-api.sapioo.com",
                changeOrigin: true,
                rewrite: (path) =>
                    path.replace(/^\/api\/whitelabel/, "/accounts/customer-portal/whitelabel"),
                // თუ ოდესმე ქონდეს self-signed სერტი, ჩართავ ამას:
                // secure: false,
            },
        },
    },
});
