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
import { Textarea } from "../ui/textarea";

export function ContactForm() {
  const [profile, setProfile] = useState(false);
  const [occupation, setOccupation] = useState(false);
  const [email, setEmail] = useState(false);
  const [phone, setPhone] = useState(false);
  const [address, setAddress] = useState(false);
  const [notes, setNotes] = useState(false);

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
        className="space-y-6 lg:max-w-[600px]"
      >
        <Icon name="Lucide/user" className="h-40 w-40" />

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
              type="button"
              variant="ghost"
              icon="Lucide/chevronsDown"
              onClick={() => setProfile(!profile)}
            />
          </div>
        </div>

        <div className="flex">
          <div className="mt-8 w-7">
            <Icon name="Lucide/building2" />
          </div>
          <div className="ml-4 w-full space-y-2">
            <FormField
              name="company"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="job_title"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {occupation && (
              <FormField
                name="department"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="mt-8 w-7">
            <Button
              type="button"
              variant="ghost"
              icon="Lucide/chevronsDown"
              onClick={() => setOccupation(!occupation)}
            />
          </div>
        </div>

        {email && (
          <div className="flex">
            <div className="mt-8 w-7">
              <Icon name="Lucide/mail" />
            </div>
            <div className="ml-4 w-full space-y-2">
              <FormField
                name="email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-8 w-7">
              <Button
                type="button"
                variant="ghost"
                icon="Lucide/x"
                onClick={() => setEmail(false)}
              />
            </div>
          </div>
        )}

        <div className="ml-10 mr-6">
          <Button
            type="button"
            icon={email ? "Lucide/circlePlus" : "Lucide/mail"}
            className="w-full justify-center rounded-full bg-indigo-50 text-indigo-600 h-10 hover:bg-indigo-100"
            onClick={() => setEmail(true)}
          >
            Add email
          </Button>
        </div>

        {phone && (
          <div className="flex">
            <div className="mt-8 w-7">
              <Icon name="Lucide/phone" />
            </div>
            <div className="ml-4 w-full space-y-2">
              <FormField
                name="phone"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-8 w-7">
              <Button
                type="button"
                variant="ghost"
                icon="Lucide/x"
                onClick={() => setPhone(false)}
              />
            </div>
          </div>
        )}

        <div className="ml-10 mr-6">
          <Button
            icon={phone ? "Lucide/circlePlus" : "Lucide/phone"}
            className="w-full justify-center rounded-full bg-indigo-50 text-indigo-600 h-10 hover:bg-indigo-100"
            onClick={() => setPhone(true)}
          >
            Add phone
          </Button>
        </div>

        {address && (
          <div className="flex">
            <div className="mt-8 w-7">
              <Icon name="Lucide/mapPin" />
            </div>
            <div className="ml-4 w-full space-y-2">
              <FormField
                name="country"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-8 w-7">
              <Button
                type="button"
                variant="ghost"
                icon="Lucide/x"
                onClick={() => setAddress(false)}
              />
            </div>
          </div>
        )}

        <div className="ml-10 mr-6">
          <Button
            type="button"
            icon={address ? "Lucide/circlePlus" : "Lucide/mapPin"}
            className="w-full justify-center rounded-full bg-indigo-50 text-indigo-600 h-10 hover:bg-indigo-100"
            onClick={() => setAddress(true)}
          >
            Add address
          </Button>
        </div>

        <div className="flex">
          <div className="mt-8 w-7">
            <Icon name="GoogleMaterial/birthday" />
          </div>
          <div className="flex gap-2 ml-4 mr-6 w-full">
            <FormField
              name="b_day"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="hidden sm:inline">Day</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="b_month"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="hidden sm:inline">Month</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="b_year"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="hidden sm:inline">Year</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {notes && (
          <div className="flex">
            <div className="mt-8 w-7">
              <Icon name="Lucide/mapPin" />
            </div>
            <div className="ml-4 w-full space-y-2">
              <FormField
                name="notes"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-8 w-7">
              <Button
                type="button"
                variant="ghost"
                icon="Lucide/x"
                onClick={() => setNotes(false)}
              />
            </div>
          </div>
        )}

        {!notes && (
          <div className="ml-10 mr-6">
            <Button
              type="button"
              icon={notes ? "Lucide/circlePlus" : "Lucide/stickyNote"}
              className="w-full justify-center rounded-full bg-indigo-50 text-indigo-600 h-10 hover:bg-indigo-100"
              onClick={() => setNotes(true)}
            >
              Add notes
            </Button>
          </div>
        )}
      </Form>
    </RemixFormProvider>
  );
}
