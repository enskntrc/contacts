import { db } from "db";
import { redirectWithError, redirectWithSuccess } from "remix-toast";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Outlet,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import { Toaster } from "~/components/ui/toaster";
import { Message } from "~/components/feedback/error";
import { namedAction } from "remix-utils/named-action";
import { authenticator } from "~/lib/services/auth.server";
import { softDeleteContact } from "~/lib/server/update.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Frequent" },
    {
      name: "frequent",
      content: "Welcome to Google Contacts!",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const contacts = await db.query.contacts.findMany({
    limit: 5,
    where: (contacts, { and, eq, not }) =>
      and(
        eq(contacts.user_id, user.id),
        eq(contacts.status, "ACTIVE"),
        not(eq(contacts.phone, ""))
      ),
    orderBy: (contacts, { desc }) => [desc(contacts.updated_at)],
  });

  if (!contacts) {
    throw new Error("There was an error fetching contacts");
  }

  return { user, contacts };
};

function FrequentContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export default function App() {
  return (
    <FrequentContactsLayout>
      <Toaster />
      <Outlet />
    </FrequentContactsLayout>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const contactId = formData.get("contactId");
  return namedAction(request, {
    async delete() {
      const response = await softDeleteContact(contactId as string);
      if (response.error) {
        return redirectWithError("/frequent", response.message);
      } else if (response.success) {
        return redirectWithSuccess("/frequent", response.message);
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
  const errorMessage = isRouteErrorResponse(error)
    ? error.data
    : error instanceof Error
    ? error.message
    : "Unknown error";

  if (isRouteErrorResponse(error)) {
    return (
      <FrequentContactsLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </FrequentContactsLayout>
    );
  } else if (error instanceof Error) {
    return (
      <FrequentContactsLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </FrequentContactsLayout>
    );
  } else {
    return (
      <FrequentContactsLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </FrequentContactsLayout>
    );
  }
}
