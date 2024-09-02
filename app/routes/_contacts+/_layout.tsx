import React from "react";
import { redirectWithError, redirectWithSuccess } from "remix-toast";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Outlet,
  isRouteErrorResponse,
  //   json,
  //   useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Message } from "~/components/feedback/error";
import { NavSidebar } from "~/components/types/contacts";
import { DynamicSidebar } from "~/components/layouts/contacts/dynamic-sidebar";
import { StaticSideBar } from "~/components/layouts/contacts/static-sidebar";
import { Header } from "~/components/layouts/contacts/header";
import { getUserFromSession } from "~/lib/actions/auth/read.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = await getUserFromSession(request);

  if (!response.successData) {
    return redirectWithError("/auth", "Please first login.");
  } else {
    return response;
  }
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
    href: "trash",
    icon: "Lucide/trash2",
  },
];

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function ContactsLayout({ children }: { children: React.ReactNode }) {
  //   const userLoggedIn = useLoaderData<UserFromSession>();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const response: ResponseDeleteUserSession = await deleteUserSession(
//     request
//   );

//   if (response.success) {
//     return redirectWithSuccess("/", "Çıkış başarılı.", {
//       headers: {
//         "Set-Cookie": response.successData ?? "",
//       },
//     });
//   } else if (!response.success) {
//     return redirectWithError("/dashboard", response.message);
//   } else {
//     return json({ ...response });
//   }
// };

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
