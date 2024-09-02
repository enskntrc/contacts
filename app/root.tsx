import { useEffect } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { getToast } from "remix-toast";
import { Toaster, toast as notify } from "sonner";

import "./tailwind.css";
import { Message } from "./components/feedback/error";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  return json({ toast }, { headers });
};

export function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster richColors />
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
