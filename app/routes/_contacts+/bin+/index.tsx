import { ContactList } from "~/components/lists/contact";

import { useLoaderData, json } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { namedAction } from "remix-utils/named-action";
import { db } from "db";

import { authenticator } from "~/lib/services/auth.server";
import { Contact } from "~/components/types/contact";
import { recoverContact } from "~/lib/server/update.server";

import { redirectWithError, redirectWithSuccess } from "remix-toast";
import { hardDeleteContact } from "~/lib/server/delete.server";

type LoaderData = {
  contacts: Contact[];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const contacts = await db.query.contacts.findMany({
    where: (contacts, { and, eq }) =>
      and(
        eq(contacts.user_id, user.id),
        eq(contacts.status, "DELETED")
      ),
    orderBy: (contacts, { desc }) => [desc(contacts.first_name)],
  });

  if (!contacts) {
    throw new Error("There was an error fetching contacts");
  }

  return { user, contacts };
};

export default function Example() {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-normal text-gray-500 leading-6">
            Bin
          </h1>
        </div>
      </div>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <ContactList route="bin" contacts={loaderData.contacts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const contactId = formData.get("contactId");

  return namedAction(request, {
    async recover() {
      const response = await recoverContact(contactId as string);

      if (response.error) {
        return redirectWithError("/bin", response.message);
      } else if (response.success) {
        return redirectWithSuccess("/bin", response.message);
      } else {
        return json({ error: response.error });
      }
    },
    async delete() {
      const response = await hardDeleteContact(contactId as string);

      if (response.error) {
        return redirectWithError("/bin", response.message);
      } else if (response.success) {
        return redirectWithSuccess("/bin", response.message);
      } else {
        return json({ error: response.error });
      }
    },
  });
};
