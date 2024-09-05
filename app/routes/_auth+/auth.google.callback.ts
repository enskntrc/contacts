import type { LoaderFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/lib/actions/services/auth.server";

export const loader = ({ request }: LoaderFunctionArgs) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};
