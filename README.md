# Project Setup Stages

## Creation of the project

- I installed the raw project in the relevant directory with the [bunx create-remix@latest](https://remix.run/docs/en/main/start/quickstart) command.
- Tailwind.css is already installed. If it hadn't come pre-installed, I could have installed it using the instructions on [tailwindcss.com](https://tailwindcss.com/docs/guides/remix).
- I arranged the `tailwind.config.ts` file like follow. I will explain why I edit like this later.

```tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}", "./plugins/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

- I edited the `vite.config.ts` file as follows so that it opens automatically in the browser when I launch the project.

  ```vite.config.ts
  import { vitePlugin as remix } from "@remix-run/dev";
  import { defineConfig } from "vite";
  import tsconfigPaths from "vite-tsconfig-paths";

  export default defineConfig({
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
      }),
      tsconfigPaths(),
    ],
    server: {
      open: true,
      port: 3000,
    },
  });
  ```

- I created a repo on [GitHub](https://github.com/new) and established the remote connection on this repo(`git remote add origin <URL>`).
- I pushed the project on this repo (`git add, git commit, git push`).

## Deploying the project

- This step is normally done last, but when I did it last, I got a `libSqlError` error that I could not resolve. That's why I will do it at the beginning, check the deploy process at every step and try to find out where the error is caused.
- I will deploy the project on Vercel. For this, I first uploaded the [@vercel/remix](https://www.npmjs.com/package/@vercel/remix) package to the project. (`bun i -D @vercel/remix`)
- I edited the `vite.config.ts` file as follows:

  ```vite.config.ts
  import { vitePlugin as remix } from "@remix-run/dev";
  import { defineConfig } from "vite";
  import tsconfigPaths from "vite-tsconfig-paths";
  import { vercelPreset } from "@vercel/remix/vite";

  export default defineConfig({
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
        presets: [vercelPreset()],
      }),
      tsconfigPaths(),
    ],
    server: {
      open: true,
      port: 3000,
    },
  });
  ```

- I submitted the changes to github. (`git add, git commit, git push`)
- [On the Vercel main screen](https://vercel.com/enskntrcs-projects), I imported the project from github to vercel.

## Adding the Remix-Development-Tools package to the project

- I imported the [remix-development-tools](https://www.npmjs.com/package/remix-development-tools) package into the project.(`bun i -D remix-development-tools`)
- I edited the `vite.config.ts` file as follows:

  ```vite.config.ts
  import { vitePlugin as remix } from "@remix-run/dev";
  import { defineConfig } from "vite";
  import tsconfigPaths from "vite-tsconfig-paths";
  import { remixDevTools } from "remix-development-tools";
  import { vercelPreset } from "@vercel/remix/vite";

  export default defineConfig({
    plugins: [
      remixDevTools(),
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
        presets: [vercelPreset()],
      }),
      tsconfigPaths(),
    ],
    server: {
      open: true,
      port: 3000,
    },
  });
  ```

- I created a `/plugins` folder in the root project (This is why I changed the content of tailwind.config.ts file ). There will be 2 plugins in this folder that I will add to remixDevTools. I edited my `vite.config.ts` file as follows:

  ```vite.config.ts
  import { vitePlugin as remix } from "@remix-run/dev";
  import { defineConfig } from "vite";
  import tsconfigPaths from "vite-tsconfig-paths";
  import { remixDevTools } from "remix-development-tools";
  import { vercelPreset } from "@vercel/remix/vite";

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
        presets: [vercelPreset()],
      }),
      tsconfigPaths(),
    ],
    server: {
      open: true,
      port: 3000,
    },
  });
  ```

- The first plugin is the [tailwind-palette](https://github.com/AlemTuzlak/remix-ecommerce/blob/main/plugins/tailwind-pallette.tsx) palette. I add the file in the link to the `./plugins` folder. If I open the RemixDevTool pop-up in the browser, I will see that the color palette has moved here.

## Handle icons

- I created `resources/icons` folder for icons svg format and added one [icon](https://icones.js.org/collection/lucide?s=shop) for example.
- I created `app/components/icon/icons` folder for icons.
- I created `app/components/icon/Icon.tsx` file. A react component for Icons like follow:

  ```Icon.tsx
  import type { SVGProps } from "react";
  import spriteHref from "./icons/icon.svg";
  import type { IconName } from "./icons/types";
  import { cn } from "~/utils/css";

  export enum IconSize {
    xs = "12",
    sm = "16",
    md = "24",
    lg = "32",
    xl = "40",
  }

  export type IconSizes = keyof typeof IconSize;

  export interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
    testId?: string;
    className?: string;
    size?: IconSizes;
  }

  /**
  * Icon component wrapper for SVG icons.
  * @returns SVG icon as a react component
  */
  export const Icon = ({ name, testId, className, size = "md", ...props }: IconProps) => {
    const iconSize = IconSize[size];
    const iconClasses = cn("inline-block flex-shrink-0", className);
    return (
      <svg
        className={iconClasses}
        fill={"currentColor"}
        stroke={"currentColor"}
        width={iconSize}
        height={iconSize}
        data-testid={testId}
        data-name={name}
        {...props}
      >
        <use href={`${spriteHref}#${name}`} />
      </svg>
    );
  };
  export { IconName };
  ```

- I created `app/lib/utils.ts` file for helper functions (thanks to shad component) like follow:

  ```utils.ts
  import clsx, { ClassValue } from "clsx";
  import { twMerge } from "tailwind-merge";

  export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
  ```

- I imported the [vite-plugin-icons-spritesheet](https://github.com/forge42dev/vite-plugin-icons-spritesheet) package to the project.(`bun i -D vite-plugin-icons-spritesheet`)
- I edited my `vite.config.ts` file as follows:

  ```vite.config.ts
  import { vitePlugin as remix } from "@remix-run/dev";
  import { defineConfig } from "vite";
  import tsconfigPaths from "vite-tsconfig-paths";
  import { remixDevTools } from "remix-development-tools";
  import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";
  import { vercelPreset } from "@vercel/remix/vite";

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
        presets: [vercelPreset()],
      }),
      tsconfigPaths(),
      iconsSpritesheet({
        inputDir: "./resources/icons",
        outputDir: "./app/components/icon/icons",
        withTypes: true,
        fileName: "icon.svg",
      }),
    ],
    server: {
      open: true,
      port: 3000,
    },
  });
  ```

- I just restart the dev (`bun dev`) and when I looked at the `app/components/icon/icons` folder, I saw that there were two files.

  - `icon.svg`
  - `types.ts`

- The second plugin is the [icon-library](https://github.com/AlemTuzlak/remix-ecommerce/blob/main/plugins/icon-library.tsx) library. I add the file in the link to the `./plugins` folder. If I open the RemixDevTool pop-up in the browser, I will see that the Icon Tab has moved here.

## Setup Turso

- I installed turso on my local machine with the information in the [turso document](https://docs.turso.tech/cli/installation). I am using windows WSL.
- I created a database on turso with `turso db create [database-name]`.
- I reached the database url with `turso db show <database-name> [flags]` and created the token with `turso db tokens create <database-name> [flags]`.
- I created the `.env` file in root project and added following keys:
  - `DATABASE_URL` as reached url but url should start with `https://` not `libsql://`.
  - `DATABASE_AUTH_TOKEN` as reached token.

## Setup Drizzle

- I imported the drizzle orm and drizzle-kit the project with following commands:

  - `bun add drizzle-orm libsql-stateless-easy`
  - `bun add -D drizzle-kit`

- I created `db/index.ts` file for client and `db/schema` folder for schema files.
- I created `users` scheama in `db/schema/users.ts` file just for tests.
- `db/index.ts` file content like following:

```index.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "libsql-stateless-easy";

import * as users from "./schema/users";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema: {
    ...users,
  },
});
```

- I created `drizzle.config.ts` file in root project with following content:

```drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema/*",
  out: "./drizzle",
  driver: "turso",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
```

- I added following scripts in `package.json` file:

```package.jason
  "scripts": {
    .
    .
    .
    "generate": "drizzle-kit generate",
    "migrate": "drizzle-kit migrate",
    "push": "drizzle-kit push",
    "introspect": "drizzle-kit introspect",
    "drop": "drizzle-kit drop",
    "studio": "drizzle-kit studio --port 3001"
  },
```

## Setup Shadcn Components

- I just followed the instructions on [shadcn - remix template](https://ui.shadcn.com/docs/installation/remix)
- I initialized the shad with `bunx shadcn@latest init` command and and answered the following questions:
  - Which style would you like to use? › New York
  - Which color would you like to use as base color? › Neutral
  - Do you want to use CSS variables for colors? › yes
- After that I can use the any shad component. For emp: `bunx --bun shadcn@latest add button`

## Use Flat Routes

- I installed the [remix-flat-routes](https://www.npmjs.com/package/remix-flat-routes) package with `bun install -D remix-flat-routes` command.
- I edited the `vite.config.ts` like following:

```vite.config.ts
import { defineConfig } from "vite";
import { remixDevTools } from "remix-development-tools";
import { vitePlugin as remix } from "@remix-run/dev";
import { flatRoutes } from "remix-flat-routes";
import { vercelPreset } from "@vercel/remix/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";

export default defineConfig({
  plugins: [
    remixDevTools({
      pluginDir: "./plugins",
    }),
    remix({
      ignoredRouteFiles: ["**/*"],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      },
      presets: [vercelPreset()],
    }),
    tsconfigPaths(),
    iconsSpritesheet({
      inputDir: "./resources/icons",
      outputDir: "./app/components/icon/icons",
      withTypes: true,
      fileName: "icon.svg",
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
});
```

## Setup Remix Toast

- I installed the [remix-toast](https://www.npmjs.com/package/remix-toast) package with `bun install remix-toast` command.
- I edited the `app/root.tsx` file like following:

```root.tsx
import { useEffect } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";

import { getToast } from "remix-toast";
import { Toaster, toast as notify } from "sonner";

import "./tailwind.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  return json({ toast }, { headers });
};

export function RootLayout({ children }: { children: React.ReactNode }) {
  const { toast } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (toast?.type === "error") {
      notify.error(toast.message);
    }
    if (toast?.type === "success") {
      notify.success(toast.message);
    }
  }, [toast]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
```

## Install Remix Hook Form

## Install Conform
