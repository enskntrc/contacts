import { useNavigate, useRouteLoaderData } from "@remix-run/react";

import { ContactList } from "~/components/lists/contact";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/icons";

import type { NakedUser } from "~/components/types/user";
import type { Contact } from "~/components/types/contact";

type RouteLoaderData = {
  user: NakedUser;
  contacts: Contact[];
};

export default function Example() {
  const navigate = useNavigate();

  const routeLoaderData = useRouteLoaderData<RouteLoaderData>(
    "routes/_contacts+/_layout"
  );
  if (!routeLoaderData)
    throw new Error("Route loader data is not available");

  return (
    <div className="flex flex-col justify-between">
      <div>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-normal text-gray-500 leading-6">
              Contacts
            </h1>
          </div>
        </div>
        <div className="mt-4 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <ContactList
                route="home"
                contacts={routeLoaderData.contacts}
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        type="button"
        onClick={() => navigate("/new")}
        className="rounded-full h-16 w-16 flex items-center justify-center lg:hidden md:block sm:block md:rounded-full sm:rounded-full fixed bottom-4 right-4"
      >
        <Icon name="Lucide/plus" />
      </Button>
    </div>
  );
}
