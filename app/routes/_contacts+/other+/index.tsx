import { ContactList } from "~/components/lists/contact";

import type { Contact } from "~/components/types/contact";
import { useRouteLoaderData } from "@remix-run/react";

type RouteLoaderData = {
  contacts: Contact[];
};

export default function Other() {
  const routeLoaderData = useRouteLoaderData<RouteLoaderData>(
    "routes/_contacts+/other+/_layout"
  );
  if (!routeLoaderData)
    throw new Error("Route loader data is not available");

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-normal text-gray-500 leading-6">
            Others
          </h1>
        </div>
      </div>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <ContactList
              route="other"
              contacts={routeLoaderData.contacts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
