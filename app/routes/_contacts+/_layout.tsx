import { useState } from "react";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { Header } from "~/components/layouts/header";
import { Message } from "~/components/feedback/error";
import { NavSidebar } from "~/components/types/dashboard";
import { StaticSideBar } from "~/components/layouts/static-sidebar";
import { DynamicSidebar } from "~/components/layouts/dynamic-sidebar";

import { authenticator } from "~/lib/services/auth.server";
import { db } from "db";

export const meta: MetaFunction = () => {
  return [
    { title: "Contacts" },
    {
      name: "contacts",
      content: "Welcome to Google Contacts!",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const contacts = await db.query.contacts.findMany({
    where: (contacts, { and, eq, not, or, like }) =>
      and(
        eq(contacts.user_id, user.id),
        eq(contacts.status, "ACTIVE"),
        not(eq(contacts.phone, "")),
        q
          ? or(
              like(contacts.first_name, `%${q}%`),
              like(contacts.last_name, `%${q}%`),
              like(contacts.phone, `%${q}%`)
            )
          : undefined
      ),
    orderBy: (contacts, { asc }) => [asc(contacts.first_name)],
  });

  if (!contacts) {
    throw new Error("There was an error fetching contacts");
  }

  return { user, contacts, q };
};

const navOverview: NavSidebar[] = [
  {
    name: "Contacts",
    href: "/",
    icon: "Lucide/usersRound",
  },
  {
    name: "Frequently Contacted",
    href: "frequent",
    icon: "Lucide/history",
  },
  {
    name: "Other Contacts",
    href: "other",
    icon: "Lucide/archiveRestore",
  },
];

const navManage: NavSidebar[] = [
  {
    name: "Merge and Fix",
    href: "suggestions",
    icon: "MaterialSymbols/handyman",
  },
  {
    name: "Import",
    href: "import",
    icon: "Lucide/download",
  },
  {
    name: "Bin",
    href: "bin",
    icon: "Lucide/trash2",
  },
];

const userNavigation = [
  { name: "Your profile", href: "#" },
  // { name: "Sign out", href: "#" },
];

function ContactsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loaderData = useLoaderData<typeof loader>();

  if (!loaderData.user) throw new Error("User not found");

  return (
    <div>
      {/* Dynamic sidebar for mobile */}
      <DynamicSidebar
        navOverview={navOverview}
        navManage={navManage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Static sidebar for desktop */}
      <StaticSideBar
        navOverview={navOverview}
        navManage={navManage}
      />

      {/* Content area */}
      <div className="lg:pl-72">
        {/* Header */}
        <Header
          userLoggedIn={loaderData.user}
          q={loaderData.q}
          navUser={userNavigation}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Your content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ContactsLayout>
      <Outlet />
    </ContactsLayout>
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
  const errorMessage = isRouteErrorResponse(error)
    ? error.data
    : error instanceof Error
    ? error.message
    : "Unknown error";

  if (isRouteErrorResponse(error)) {
    return (
      <ContactsLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </ContactsLayout>
    );
  } else if (error instanceof Error) {
    return (
      <ContactsLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </ContactsLayout>
    );
  } else {
    return (
      <ContactsLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </ContactsLayout>
    );
  }
}
