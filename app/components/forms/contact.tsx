import { useState } from "react";
import { Form } from "@remix-run/react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Icon } from "../icons";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function ContactForm() {
  const [profile, setProfile] = useState(false);
  const form = useRemixForm({
    defaultValues: {
      prefix: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix: "",
      phonetic_first: "",
      phonetic_middle: "",
      phonetic_last: "",
      nickname: "",
      file_as: "",

      company: "",
      job_title: "",
      department: "",

      email: "",
      phone: "",

      country: "",
      street: "",
      postcode: "",
      district: "",
      province: "",

      b_day: "",
      b_month: "",
      b_year: "",

      notes: "",
    },
  });
  const { handleSubmit, control } = form;
  return (
    <RemixFormProvider {...form}>
      <Form
        onSubmit={handleSubmit}
        className="space-y-4 lg:max-w-[600px]"
      >
        <Icon name="Lucide/user" />
        <div className="flex">
          <div className="mt-8 w-7">
            <Icon name="Lucide/user" />
          </div>
          <div className="ml-4 w-full space-y-2">
            {profile && (
              <FormField
                name="prefix"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefix</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              name="first_name"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {profile && (
              <FormField
                name="middle_name"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              name="last_name"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {profile && (
              <>
                <FormField
                  name="suffix"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suffix</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="phonetic_first"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phonetic First</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="phonetic_middle"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phonetic Middle</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="phonetic_last"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phonetic Last</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="nickname"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nickname</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="file_as"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File As</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <div className="mt-8 w-7">
            <Button
              variant="ghost"
              icon="Lucide/chevronsDown"
              onClick={() => setProfile(!profile)}
            />
          </div>
        </div>
        <div className="">Company</div>
        <div className="">Email</div>
      </Form>
    </RemixFormProvider>
  );
}
