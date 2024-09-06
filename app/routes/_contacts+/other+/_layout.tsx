import { db } from "db";
import { redirectWithError, redirectWithSuccess } from "remix-toast";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Outlet,
  isRouteErrorResponse,
  json,
  useRouteError,
} from "@remix-run/react";

import { Toaster } from "~/components/ui/toaster";
import { Message } from "~/components/feedback/error";
import { namedAction } from "remix-utils/named-action";
import { authenticator } from "~/lib/services/auth.server";
import { softDeleteContact } from "~/lib/server/update.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Other" },
    {
      name: "other",
      content: "Welcome to Google Contacts!",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const contacts = await db.query.contacts.findMany({
    where: (contacts, { and, eq }) =>
      and(
        eq(contacts.user_id, user.id),
        eq(contacts.status, "ACTIVE"),
        eq(contacts.phone, "")
      ),
    orderBy: (contacts, { desc }) => [desc(contacts.updated_at)],
  });

  if (!contacts) {
    throw new Error("There was an error fetching contacts");
  }

  return { user, contacts };
};

function OtherContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export default function App() {
  return (
    <OtherContactsLayout>
      <Toaster />
      <Outlet />
    </OtherContactsLayout>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const contactId = formData.get("contactId");
  return namedAction(request, {
    async delete() {
      const response = await softDeleteContact(contactId as string);
      if (response.error) {
        return redirectWithError("/other", response.message);
      } else if (response.success) {
        return redirectWithSuccess("/other", response.message);
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
      <OtherContactsLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </OtherContactsLayout>
    );
  } else if (error instanceof Error) {
    return (
      <OtherContactsLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </OtherContactsLayout>
    );
  } else {
    return (
      <OtherContactsLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </OtherContactsLayout>
    );
  }
}
