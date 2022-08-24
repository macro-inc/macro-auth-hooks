import { defineConfig } from "vite"
import { resolve } from "node:path"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: 'macro-auth-hooks',
      formats: ["es"],
      fileName: (format) => `index.${format}.js`
    },
  }
})

