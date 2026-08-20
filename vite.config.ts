import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const configuredBase = env.VITE_BASE_PATH || "/";
  const base = configuredBase.endsWith("/") ? configuredBase : `${configuredBase}/`;

  return {
    base,
    build: {
      rolldownOptions: {
        output: {
          strictExecutionOrder: true,
        },
      },
    },
    plugins: [
      tailwindcss(),
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({ server: { entry: "server" } }),
      ...(command === "build" ? [nitro({ preset: "node-server", baseURL: base })] : []),
      react(),
    ],
    server: {
      host: "0.0.0.0",
      port: 8080,
    },
  };
});
