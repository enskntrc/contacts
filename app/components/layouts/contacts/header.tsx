import { Link } from "@remix-run/react";
import { Icon } from "~/components/icons";
import type { HeaderProps } from "~/components/types/contacts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function Header({ navUser, setSidebarOpen }: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Icon
          name="Lucide/menu"
          aria-hidden="true"
          className="h-6 w-6"
        />
      </button>

      {/* Separator */}
      <div
        aria-hidden="true"
        className="h-6 w-px bg-gray-200 lg:hidden"
      />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form
          action="#"
          method="GET"
          className="relative flex flex-1"
        >
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Icon
            name="Lucide/search"
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
          />
          <input
            id="search-field"
            name="search"
            type="search"
            placeholder="Search..."
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <Icon
              name="Lucide/bellRing"
              aria-hidden="true"
              className="h-6 w-6"
            />
          </button>

          {/* Separator */}
          <div
            aria-hidden="true"
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
          />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <Avatar>
                <AvatarImage
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="@shadcn"
                />
                <AvatarFallback>USER</AvatarFallback>
              </Avatar>
              <span className="hidden lg:flex lg:items-center">
                <span
                  aria-hidden="true"
                  className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                >
                  Tom Cook
                </span>
                <Icon
                  name="Lucide/chevronsDown"
                  aria-hidden="true"
                  className="ml-2 h-5 w-5 text-gray-400"
                />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navUser.map((item) => (
                <DropdownMenuItem key={item.name}>
                  <Link
                    to={item.href}
                    className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
