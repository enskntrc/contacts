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
import { Separator } from "~/components/ui/separator";
import { authenticator } from "~/lib/services/auth.server";
import { schema } from "~/lib/schemas/register";
import { z } from "zod";
import { db } from "db";
import { RegisterForm } from "~/components/forms/register";
import { Button } from "~/components/ui/button";
import {
  commitSession,
  getSession,
} from "~/lib/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
}

export default function Register() {
  const navigation = useNavigation();
  const isFormSubmitting = navigation.state === "submitting";
  const isRegisteringWithEmail =
    isFormSubmitting && navigation.formAction !== "/auth/google";
  const isRegisteringWithGoogle =
    isFormSubmitting && navigation.formAction === "/auth/google";
  const lastResult = useActionData<typeof action>();

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          alt="Your Company"
          src="contacts.png"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <RegisterForm
            lastResult={lastResult}
            isRegisteringWithEmail={isRegisteringWithEmail}
          />

          <p className="mt-10 text-start text-sm text-gray-500">
            Your password must meet the following requirements:
          </p>
          <Separator
            className="mt-2"
            color="gray"
            orientation="horizontal"
          />
          <ol className="mt-2 text-sm text-gray-500 list-disc list-inside">
            <li>At least 8 characters long</li>
            <li>A capital letter must be included</li>
            <li>A lowercase letter must be included</li>
            <li>A number must be included</li>
            <li>
              A special character must be included (e.g. #?!@$%^&*-){" "}
            </li>
          </ol>

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
                    isRegisteringWithGoogle
                      ? "Lucide/refreshCcw"
                      : "GoogleMaterial/google"
                  }
                  className="mt-6 bg-transparent w-full justify-center"
                  disabled={isRegisteringWithGoogle}
                >
                  {isRegisteringWithGoogle
                    ? "Please wait..."
                    : "Google"}
                </Button>
              </Form>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Login
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

      if (existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "A user with this email already exists",
        });
        return;
      }
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const user = await authenticator.authenticate(
    "user-pass",
    request,
    {
      throwOnError: true,
      context: {
        ...submission.value,
        type: "register",
      },
    }
  );

  const session = await getSession(request.headers.get("cookie"));
  session.set(authenticator.sessionKey, user);
  const headers = new Headers({
    "Set-Cookie": await commitSession(session),
  });

  return redirect("/", { headers });
};
