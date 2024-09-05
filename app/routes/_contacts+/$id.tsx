import { useRef } from "react";
import { namedAction } from "remix-utils/named-action";
import { getValidatedFormData } from "remix-hook-form";
import {
  ActionFunctionArgs,
  json,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
  Form,
  useParams,
  useRouteLoaderData,
  useLoaderData,
} from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getImageUrl,
  supabaseUploadHandler,
} from "~/lib/actions/services/supabase.server";
import { generateId } from "~/lib/utils";
import { type ContactFormData, schema } from "~/lib/schemas/contact";

import { ContactForm } from "~/components/forms/contact";
import { NakedUser } from "~/components/types/user";
import { Contact } from "~/components/types/contact";
import { Icon } from "~/components/icons";
import { Button } from "~/components/ui/button";

import { db } from "db";
import { contacts } from "db/schema/contacts";
import { eq } from "drizzle-orm";

type RouteLoaderData = {
  user: NakedUser;
  contacts: Contact[];
};

export const loader = () => {
  // Gets the public image url so we can show it
  return { imageUrl: getImageUrl("profile.jpg") };
};

export default function EditContact() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const { imageUrl } = useLoaderData<typeof loader>();
  const routeLoaderData = useRouteLoaderData<RouteLoaderData>(
    "routes/_contacts+/_layout"
  );
  if (!routeLoaderData)
    throw new Error("Route loader data is not available");

  const contact = routeLoaderData.contacts.find(
    (contact) => contact.id === id
  );

  return (
    <div>
      <Form
        onChange={(e) => e.currentTarget.submit()}
        encType="multipart/form-data"
        method="post"
        action="?/upload"
      >
        <input
          style={{ display: "none" }}
          name="image"
          ref={inputRef}
          type="file"
        />
      </Form>
      <div className="flex items-end">
        <img src={imageUrl} alt="" />
        <Icon name="Lucide/user" className="h-40 w-40" />
        <Button
          icon="Lucide/circlePlus"
          variant="constructive"
          onClick={() => inputRef.current?.click()}
          className="pr-1 mb-3"
        />
      </div>

      <ContactForm
        userId={routeLoaderData.user.id}
        contact={contact}
      />
    </div>
  );
}

export const action = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<ContactFormData>(
    request,
    zodResolver(schema)
  );
  if (errors) return json({ errors, defaultValues });

  return namedAction(request, {
    async create() {
      const response = await db
        .insert(contacts)
        .values({
          id: generateId("workspace"),
          status: "ACTIVE",
          user_id: defaultValues.userId,
          ...data,
        })
        .returning()
        .then((res) => res[0] ?? null);

      if (!response) {
        return redirect("/new");
      } else {
        return redirect("/");
      }
    },
    async update() {
      const response = await db
        .update(contacts)
        .set({
          updated_at: new Date(),
          ...data,
        })
        .where(eq(contacts.id, params.id as string))
        .returning()
        .then((res) => res[0] ?? null);

      if (!response) {
        return redirect(`/${params.id}`);
      } else {
        return redirect("/");
      }
    },
    async upload() {
      const formData = await unstable_parseMultipartFormData(
        request,
        supabaseUploadHandler("profile.jpg")
      );
      console.log(formData.get("image"));
      return json({ data: formData.get("image") });
    },
  });
};
