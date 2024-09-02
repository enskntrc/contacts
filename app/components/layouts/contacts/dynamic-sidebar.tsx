import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Link, NavLink } from "@remix-run/react";
import { Icon } from "~/components/icons";
import type { DynamicSidebarProps } from "~/components/types/contacts";
import { cn } from "~/lib/utils";

export function DynamicSidebar({
  navOverview,
  navManage,
  sidebarOpen,
  setSidebarOpen,
}: DynamicSidebarProps) {
  return (
    <Dialog
      open={sidebarOpen}
      onClose={setSidebarOpen}
      className="relative z-50 lg:hidden"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex">
        <DialogPanel
          transition
          className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
        >
          <TransitionChild>
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="-m-2.5 p-2.5"
              >
                <span className="sr-only">Close sidebar</span>
                <Icon
                  name="Lucide/x"
                  aria-hidden="true"
                  className="h-6 w-6 text-white"
                />
              </button>
            </div>
          </TransitionChild>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
            <Link to="/" className="flex h-16 shrink-0 items-center">
              <img
                alt="Your Company"
                src="contacts.png"
                className="h-8 w-auto"
              />
              <h1 className="ml-4 text-2xl font-semibold text-gray-500">
                Contacts
              </h1>
            </Link>
            <nav className="flex flex-1 flex-col">
              <ul
                // role="list"
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
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            )
                          }
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon
                            name={item.icon}
                            aria-hidden="true"
                            className="h-6 w-6 shrink-0"
                          />
                          <span className="truncate">
                            {item.name}
                          </span>
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
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            )
                          }
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon
                            name={item.icon}
                            aria-hidden="true"
                            className="h-6 w-6 shrink-0"
                          />
                          <span className="truncate">
                            {item.name}
                          </span>
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
        </DialogPanel>
      </div>
    </Dialog>
  );
}
