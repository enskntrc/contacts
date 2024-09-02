import { useEffect, useState } from "react";
import { Form, useNavigation } from "@remix-run/react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { schema, type AuthFormData } from "~/lib/schemas/auth";
import { Action } from "../types/auth";
import { Separator } from "../ui/separator";

export function AuthForm() {
  const navigation = useNavigation();
  const [action, setAction] = useState<Action>("?/login");

  const form = useRemixForm<AuthFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    submitConfig: { method: "post", action },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, control, formState, reset } = form;
  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <RemixFormProvider {...form}>
      <Form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          name="email"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
              {action === "?/register" && (
                <FormDescription>
                  <p className="mt-10 text-start text-sm text-gray-500">
                    Your password must meet the following
                    requirements:
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
                      A special character must be included (e.g.
                      #?!@$%^&*-){" "}
                    </li>
                  </ol>
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="constructive"
          icon="Lucide/circleCheck"
          className="mt-6 bg-transparent w-full justify-center"
          disabled={navigation.state !== "idle"}
        >
          {navigation.state !== "idle"
            ? "Loading..."
            : action === "?/login"
            ? "Sign in"
            : "Register"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            setAction(action === "?/login" ? "?/register" : "?/login")
          }
          className="mt-4 w-full justify-center hover:bg-inherit hover:underline"
        >
          {action === "?/login"
            ? "Don't have an account? Register"
            : "Already have an account? Sign in"}
        </Button>
      </Form>
    </RemixFormProvider>
  );
}
