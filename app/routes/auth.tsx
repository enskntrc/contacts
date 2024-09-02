import { namedAction } from "remix-utils/named-action";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, Link } from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import { AuthForm } from "~/components/forms/auth";
import { Icon } from "~/components/icons";
import { AuthFormData, schema } from "~/lib/schemas/auth";
import { redirectWithError, redirectWithSuccess } from "remix-toast";

import { register } from "~/lib/actions/user/create.server";
import {
  getUserFromSession,
  login,
} from "~/lib/actions/auth/read.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Auth" },
    {
      name: "authentiacation",
      content: "Welcome to Google Contacts!",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = await getUserFromSession(request);

  if (response.successData) {
    return redirectWithError("/", "Please first logout.");
  } else {
    return json({
      message: "Welcome to Google Contacts!",
    });
  }
};

export default function Auth() {
  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              alt="Your Company"
              src="contacts.png"
              className="h-10 w-auto"
            />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10">
            <AuthForm />

            <div className="mt-10">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Link
                  to="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <Icon
                    name="GoogleMaterial/google"
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                  <span className="text-sm font-semibold leading-6">
                    Google
                  </span>
                </Link>

                <Link
                  to="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <Icon
                    name="Lucide/github"
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                  <span className="text-sm font-semibold leading-6">
                    GitHub
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<AuthFormData>(
    request,
    zodResolver(schema)
  );
  if (errors) return json({ errors, defaultValues });

  return namedAction(request, {
    async login() {
      const response = await login(data.email, data.password);
      if (response.successData) {
        return redirectWithSuccess("/", response.message, {
          headers: {
            "Set-Cookie": response.successData.session ?? "",
          },
        });
      } else if (response.errorData) {
        return redirectWithError("/auth", response.message);
      } else {
        return json(response);
      }
    },
    async register() {
      const response = await register(data);
      if (response.successData) {
        return redirectWithSuccess("/", response.message, {
          headers: {
            "Set-Cookie": response.successData.session ?? "",
          },
        });
      } else if (response.errorData) {
        return redirectWithError("/auth", response.message);
      } else {
        return json(response);
      }
    },
  });
};
