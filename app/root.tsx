import { ActionFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import "./tailwind.css";
import { Message } from "./components/feedback/error";
import { authenticator } from "./lib/actions/services/auth.server";
import { namedAction } from "remix-utils/named-action";
import { db } from "db";
import { contacts } from "db/schema/contacts";
import { eq } from "drizzle-orm";

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
  const formData = await request.formData();
  const contactId = formData.get("contactId");
  return namedAction(request, {
    async logout() {
      return await authenticator.logout(request, {
        redirectTo: "/login",
      });
    },
    async delete() {
      // console.log("delete", contactId);
      await db
        .update(contacts)
        .set({
          status: "DELETED",
          deleted_at: new Date(),
        })
        .where(eq(contacts.id, contactId as string))
        .returning()
        .then((res) => res[0] ?? null);

      return redirect("/");
      // return json({ data: "deleted" });
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
