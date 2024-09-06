import { defineConfig } from "vite";
// import { remixDevTools } from "remix-development-tools";
import { vitePlugin as remix } from "@remix-run/dev";
import { flatRoutes } from "remix-flat-routes";
import tsconfigPaths from "vite-tsconfig-paths";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";
import { vercelPreset } from "@vercel/remix/vite";

export default defineConfig({
  plugins: [
    // remixDevTools({
    //   pluginDir: "./plugins",
    // }),
    remix({
      ignoredRouteFiles: ["**/*"],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      },
      presets: [vercelPreset()],
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
