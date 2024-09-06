import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
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

import "./tailwind.css";
import { Message } from "./components/feedback/error";
import { authenticator } from "./lib/services/auth.server";
import { namedAction } from "remix-utils/named-action";

import { Toaster, toast as notify } from "sonner";
import {
  getToast,
  redirectWithError,
  redirectWithSuccess,
} from "remix-toast";
import { useEffect } from "react";
import { softDeleteContact } from "./lib/server/update.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);

  const FRONTEND_ENV = {
    S3_ENDPOINT: process.env.S3_ENDPOINT!,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME!,
  };

  return json(
    {
      toast,
      FRONTEND_ENV,
    },
    { headers }
  );
};

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
  const { toast, FRONTEND_ENV } = useLoaderData<typeof loader>();

  useEffect(() => {
    window.ENV = FRONTEND_ENV;
  }, [FRONTEND_ENV]);

  useEffect(() => {
    if (toast?.type === "error") {
      notify.error(toast.message);
    }
    if (toast?.type === "success") {
      notify.success(toast.message);
    }
  }, [toast]);
  return (
    <RootLayout>
      <Toaster richColors />
      <Outlet />
    </RootLayout>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const contactId = formData.get("contactId");
  return namedAction(request, {
    async delete() {
      const response = await softDeleteContact(contactId as string);
      if (response.error) {
        return redirectWithError("/", response.message);
      } else if (response.success) {
        return redirectWithSuccess("/", response.message);
      } else {
        return json(
          { error: "There was an error deleting the contact" },
          {
            status: 500,
          }
        );
      }
    },
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
