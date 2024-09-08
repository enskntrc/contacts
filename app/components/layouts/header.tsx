import {
  Form,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Icon } from "~/components/icons";
import type { HeaderProps } from "~/components/types/dashboard";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";

export function Header({
  userLoggedIn,
  q,
  navUser,
  setSidebarOpen,
}: HeaderProps) {
  const submit = useSubmit();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  const [query, setQuery] = useState(q || "");

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

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
        <Form
          onChange={(event) => submit(event.currentTarget)}
          className="relative flex flex-1"
          role="search"
        >
          <label htmlFor="q" className="sr-only">
            Search
          </label>
          <Icon
            name={searching ? "Lucide/refreshCcw" : "Lucide/search"}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
          />
          <input
            id="q"
            name="q"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search..."
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          />
        </Form>
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
                <AvatarImage src="avatar.jpg" alt="@shadcn" />
                <AvatarFallback>
                  <span className="text-xs font-semibold leading-4 text-white bg-gray-400 rounded-full h-8 w-8 flex items-center justify-center">
                    {userLoggedIn.name
                      ? userLoggedIn.name[0].toUpperCase()
                      : "UK"}
                  </span>
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:flex lg:items-center">
                <span
                  aria-hidden="true"
                  className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                >
                  {userLoggedIn?.name}
                </span>
                <Icon
                  name="Lucide/chevronsDown"
                  aria-hidden="true"
                  className="ml-2 h-5 w-5 text-gray-400"
                />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
              {navUser.map((item) => (
                <DropdownMenuItem key={item.name}>
                  <Button
                    variant="link"
                    onClick={() => navigate(item.href)}
                  >
                    {item.name}
                  </Button>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem>
                <Button
                  variant="link"
                  onClick={() =>
                    submit(null, {
                      method: "post",
                      action: "/auth/logout",
                    })
                  }
                >
                  Log out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
