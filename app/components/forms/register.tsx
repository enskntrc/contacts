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

import { schema } from "~/lib/schemas/register";

export function RegisterForm({
  isRegisteringWithEmail,
  lastResult,
}: {
  isRegisteringWithEmail: boolean;
  lastResult: SubmissionResult<string[]> | undefined | null;
}) {
  const id = useId();
  const [form, { name, email, password, confirmPassword }] = useForm({
    id,
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Form method="post" {...getFormProps(form)} className="space-y-6">
      <div>
        <Label htmlFor={name.id}>Name</Label>
        <div className="mt-2">
          <Input {...getInputProps(name, { type: "text" })} />
        </div>
        <div id={name.errorId} className="mt-2 text-sm text-red-500">
          {name.errors}
        </div>
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

      <div>
        <Label htmlFor={confirmPassword.id}>Confirm Password</Label>
        <div className="mt-2">
          <Input
            {...getInputProps(confirmPassword, { type: "password" })}
          />
        </div>
        <div
          id={confirmPassword.errorId}
          className="mt-2 text-sm text-red-500"
        >
          {confirmPassword.errors}
        </div>
      </div>

      <Button
        type="submit"
        variant="constructive"
        icon={
          isRegisteringWithEmail
            ? "Lucide/refreshCcw"
            : "Lucide/check"
        }
        className="mt-6 bg-transparent w-full justify-center"
        disabled={isRegisteringWithEmail}
      >
        {isRegisteringWithEmail ? "Please wait..." : "Register"}
      </Button>
    </Form>
  );
}
