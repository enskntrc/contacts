import { parseWithZod } from "@conform-to/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { db } from "db";
import { z } from "zod";
import { LoginForm } from "~/components/forms/login";
import { Button } from "~/components/ui/button";
import { authenticator } from "~/lib/services/auth.server";
import {
  commitSession,
  getSession,
} from "~/lib/services/session.server";
import { schema } from "~/lib/schemas/login";

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

export default function Login() {
  const navigation = useNavigation();
  const lastResult = useActionData<typeof action>();

  const isFormSubmitting = navigation.state === "submitting";
  const isSigningInWithEmail =
    isFormSubmitting && navigation.formAction !== "/auth/google";
  const isSigningInWithGoogle =
    isFormSubmitting && navigation.formAction === "/auth/google";

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          alt="Your Company"
          src="contacts.png"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <LoginForm
            lastResult={lastResult}
            isSigningInWithEmail={isSigningInWithEmail}
          />

          <div>
            <div className="relative mt-10">
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

            <div className="mt-6">
              <Form action="/auth/google" method="post">
                <Button
                  type="submit"
                  variant="constructive"
                  icon={
                    isSigningInWithGoogle
                      ? "Lucide/refreshCcw"
                      : "GoogleMaterial/google"
                  }
                  className="mt-6 bg-transparent w-full justify-center"
                  disabled={isSigningInWithGoogle}
                >
                  {isSigningInWithGoogle
                    ? "Please wait..."
                    : "Google"}
                </Button>
              </Form>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            to="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();

  const submission = await parseWithZod(formData, {
    schema: schema.superRefine(async (data, ctx) => {
      const existingUser = await db.query.users.findFirst({
        where: (users, { and, eq }) =>
          and(
            eq(users.status, "ACTIVE"),
            eq(users.email, data.email)
          ),
      });

      if (!existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "Either email or password is incorrect",
        });
        return;
      }
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const user = await authenticator.authenticate(
      "user-pass",
      request,
      {
        throwOnError: true,
        context: {
          ...submission.value,
          type: "login",
        },
      }
    );

    const session = await getSession(request.headers.get("cookie"));
    session.set(authenticator.sessionKey, user);
    const headers = new Headers({
      "Set-Cookie": await commitSession(session),
    });

    return redirect("/", { headers });
  } catch (error: any) {
    const typedError = error as any;

    switch (typedError.message) {
      case "INVALID_PASSWORD":
        return {
          ...submission,
          error: { email: ["Either email or password is incorrect"] },
        };
      case "GOOGLE_SIGNUP":
        return {
          ...submission,
          error: {
            email: [
              "You have already signed up with google. Please use google to login",
            ],
          },
        };
      default:
        return null;
    }
  }
};
