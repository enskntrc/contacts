import {
  isRouteErrorResponse,
  Outlet,
  useRouteError,
} from "@remix-run/react";
import { Message } from "~/components/feedback/error";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default function App() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
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
      <AuthLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </AuthLayout>
    );
  } else if (error instanceof Error) {
    return (
      <AuthLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </AuthLayout>
    );
  } else {
    return (
      <AuthLayout>
        <Message
          status={status}
          statusText={statusText}
          message={errorMessage}
        />
      </AuthLayout>
    );
  }
}
