import { defineConfig } from "vite";
import { remixDevTools } from "remix-development-tools";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";

export default defineConfig({
  plugins: [
    remixDevTools({
      pluginDir: "./plugins",
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    iconsSpritesheet({
      inputDir: "./resources/svg-icons",
      outputDir: "./public",
      typesOutputFile: "./app/components/types/icon.ts",
      withTypes: true,
      fileName: "icons.svg",
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
});
