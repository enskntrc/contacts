import { Link, useNavigate, NavLink } from "@remix-run/react";
import { Icon } from "~/components/icons";
import type { StaticSideBarProps } from "~/components/types/dashboard";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";

export function StaticSideBar({
  navOverview,
  navManage,
}: StaticSideBarProps) {
  const navigate = useNavigate();
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gray-50 px-6 pb-4">
        <Link to="/" className="flex h-16 shrink-0 items-center">
          <img
            alt="Your Company"
            src="contacts.png"
            className="h-8 w-auto"
          />
          <h1 className="ml-4 text-2xl font-normal text-gray-500">
            Contacts
          </h1>
        </Link>
        <Button
          type="button"
          onClick={() => navigate("/new")}
          className="hidden lg:block"
        >
          Add Contact
        </Button>
        <nav className="flex flex-1 flex-col">
          <ul
            //   role="list"
            className="flex flex-1 flex-col gap-y-7"
          >
            <li>
              <ul
                //   role="list"
                className="-mx-2 space-y-1"
              >
                {navOverview.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive, isPending }) =>
                        cn(
                          isActive
                            ? "bg-gray-50 text-indigo-600"
                            : isPending
                            ? "border-transparent text-gray-500"
                            : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )
                      }
                    >
                      <Icon
                        name={item.icon}
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0"
                      />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <div className="font-semibold leading-6 text-gray-600">
                Fix and manage
              </div>
              <ul
                //   role="list"
                className="-mx-2 mt-6 space-y-1"
              >
                {navManage.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive, isPending }) =>
                        cn(
                          isActive
                            ? "bg-gray-50 text-indigo-600"
                            : isPending
                            ? "border-transparent text-gray-500"
                            : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )
                      }
                    >
                      <Icon
                        name={item.icon}
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0"
                      />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            {/* <li className="mt-auto">
              <a
                href="#"
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
              >
                <Cog6ToothIcon
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                />
                Settings
              </a>
            </li> */}
          </ul>
        </nav>
      </div>
    </div>
  );
}
