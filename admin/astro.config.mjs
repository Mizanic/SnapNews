// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
    output: "static",
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "viewport",
    },
    vite: {
        plugins: [tailwindcss()],
    },
    server: {
        port: 7000,
    },
    env: {
        schema: {
            PUBLIC_CDK_AWS_REGION: envField.string({ context: "client", access: "public" }),
            PUBLIC_USER_POOL_ID: envField.string({ context: "client", access: "public" }),
            PUBLIC_APP_CLIENT_ID: envField.string({ context: "client", access: "public" }),
            PUBLIC_RECAPATCHA_CLIENT_KEY: envField.string({
                context: "client",
                access: "public",
                default: "6LfzuYwqAAAAAIPcU6sHC0ralyhfDK9xeadWHM5j",
            }),
        },
    },
});
