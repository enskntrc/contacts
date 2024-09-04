import { ActionFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import "./tailwind.css";
import { Message } from "./components/feedback/error";
import { authenticator } from "./lib/actions/services/auth.server";

export function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
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

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.logout(request, {
    redirectTo: "/login",
  });
};

export function ErrorBoundary() {
  const error = useRouteError();

  const status = isRouteErrorResponse(error)
    ? error.status
    : error instanceof Error
    ? error.stack
    : 500;
  const statusText = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
    ? error.name
    : "Something went wrong";
  const message = isRouteErrorResponse(error)
    ? error.data
    : error instanceof Error
    ? error.message
    : "Unknown error";

  if (isRouteErrorResponse(error)) {
    return (
      <RootLayout>
        <Message
          status={status}
          statusText={statusText}
          message={message}
        />
      </RootLayout>
    );
  } else if (error instanceof Error) {
    return (
      <RootLayout>
        <Message
          status={status}
          statusText={statusText}
          message={message}
        />
      </RootLayout>
    );
  } else {
    return (
      <RootLayout>
        <Message
          status={status}
          statusText={statusText}
          message={message}
        />
      </RootLayout>
    );
  }
}
