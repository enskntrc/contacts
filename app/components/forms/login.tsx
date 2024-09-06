import { useId } from "react";
import { Form } from "@remix-run/react";
import {
  useForm,
  getInputProps,
  getFormProps,
  SubmissionResult,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

import { schema } from "~/lib/schemas/login";

export function LoginForm({
  isSigningInWithEmail,
  lastResult,
}: {
  isSigningInWithEmail: boolean;
  lastResult: SubmissionResult<string[]> | undefined | null;
}) {
  const id = useId();
  const [form, { email, password }] = useForm({
    id,
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Form method="post" {...getFormProps(form)}>
      <div className="mt-2 text-sm text-red-500">{form.errors}</div>
      <div className="mt-2 text-sm text-red-500">
        {lastResult?.error?.message}
      </div>
      <div>
        <Label htmlFor={email.id}>Email</Label>
        <div className="mt-2">
          <Input {...getInputProps(email, { type: "email" })} />
        </div>
        <div id={email.errorId} className="mt-2 text-sm text-red-500">
          {email.errors}
        </div>
      </div>
      <div>
        <Label htmlFor={password.id}>Password</Label>
        <div className="mt-2">
          <Input {...getInputProps(password, { type: "password" })} />
        </div>
        <div
          id={password.errorId}
          className="mt-2 text-sm text-red-500"
        >
          {password.errors}
        </div>
      </div>
      <Button
        type="submit"
        variant="constructive"
        icon={
          isSigningInWithEmail ? "Lucide/refreshCcw" : "Lucide/check"
        }
        className="mt-6 bg-transparent w-full justify-center"
        disabled={isSigningInWithEmail}
      >
        {isSigningInWithEmail ? "Please wait..." : "Login"}
      </Button>
    </Form>
  );
}
