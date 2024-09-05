import { ContactList } from "~/components/lists/contact";

import type { Contact } from "~/components/types/contact";
import { Link, useRouteLoaderData } from "@remix-run/react";

type RouteLoaderData = {
  contacts: Contact[];
};

export default function Example() {
  const routeLoaderData = useRouteLoaderData<RouteLoaderData>(
    "routes/_contacts+/_layout"
  );
  if (!routeLoaderData)
    throw new Error("Route loader data is not available");

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-normal text-gray-500 leading-6">
            Contacts
          </h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            to="new"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Contact
          </Link>
        </div>
      </div>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <ContactList contacts={routeLoaderData.contacts} />
          </div>
        </div>
      </div>
    </div>
  );
}
