import {defineConfig} from "vite";

export default defineConfig({
    ssr: {
        noExternal: true
    },
    build: {
        // generate .vite/manifest.json in outDir
        manifest: true,
        rollupOptions: {
            // overwrite default .html entry
            input: '/src/main.ts',
            output: {
                entryFileNames: "main.js",
                minifyInternalExports: false
            }
        },
    },
})