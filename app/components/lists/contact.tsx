import { useNavigate, useSubmit } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/custom/data-table";
import { Icon } from "~/components/icons";
import { Contact } from "~/components/types/contact";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";

type ContactListProps = {
  contacts: Contact[];
  route: "home" | "bin" | "frequent" | "other";
};

export function ContactList({ contacts, route }: ContactListProps) {
  const navigate = useNavigate();
  const submit = useSubmit();

  const fullname: ColumnDef<Contact>[] = [
    {
      id: "fullname",
      header: "Name",
      cell: ({ row }) => {
        const first = row.original.first_name;
        const last = row.original.last_name;
        const currentImageUrl = row.original.img_url;
        return (
          <div className="flex items-center">
            <Avatar>
              <AvatarImage
                src={currentImageUrl ?? ""}
                alt="Uploaded"
              />
              <AvatarFallback>
                {first[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="mr-1 ml-3">{first}</p>
            <p className="text-gray-500">{last}</p>
          </div>
        );
      },
    },
  ];
  const email: ColumnDef<Contact>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
  ];
  const phone: ColumnDef<Contact>[] = [
    {
      accessorKey: "phone",
      header: "Phone",
    },
  ];
  const job: ColumnDef<Contact>[] = [
    {
      header: "Job Title and Company",
      cell: ({ row }) => {
        const job = row.original.job_title;
        const company = row.original.company;
        return (
          <div className="flex">
            <p className="mr-1">{job}</p>
            <p className="text-gray-500">{company}</p>
          </div>
        );
      },
    },
  ];
  const home_actions: ColumnDef<Contact>[] = [
    {
      id: "home_actions",
      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              icon="Lucide/squarePen"
              className="text-right font-medium h-8 w-8 p-0"
              onClick={() => {
                return navigate(`/${contact.id}`);
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  icon="GoogleMaterial/elipsis"
                  className="text-right font-medium h-8 w-8"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="flex justify-between"
                  onClick={() => {
                    return submit(
                      { contactId: contact.id },
                      { method: "post", action: "?/delete" }
                    );
                  }}
                >
                  <span>Delete</span>
                  <Icon
                    name="Lucide/trash"
                    className="ml-2 h-4 w-4"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const frequent_actions: ColumnDef<Contact>[] = [
    {
      id: "frequent_actions",
      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              icon="Lucide/squarePen"
              className="text-right font-medium h-8 w-8 p-0"
              onClick={() => {
                return navigate(`/frequent/${contact.id}`);
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  icon="GoogleMaterial/elipsis"
                  className="text-right font-medium h-8 w-8"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="flex justify-between"
                  onClick={() => {
                    return submit(
                      { contactId: contact.id },
                      { method: "post", action: "?/delete" }
                    );
                  }}
                >
                  <span>Delete</span>
                  <Icon
                    name="Lucide/trash"
                    className="ml-2 h-4 w-4"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const other_actions: ColumnDef<Contact>[] = [
    {
      id: "other_actions",
      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              icon="Lucide/squarePen"
              className="text-right font-medium h-8 w-8 p-0"
              onClick={() => {
                return navigate(`/other/${contact.id}`);
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  icon="GoogleMaterial/elipsis"
                  className="text-right font-medium h-8 w-8"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="flex justify-between"
                  onClick={() => {
                    return submit(
                      { contactId: contact.id },
                      { method: "post", action: "?/delete" }
                    );
                  }}
                >
                  <span>Delete</span>
                  <Icon
                    name="Lucide/trash"
                    className="ml-2 h-4 w-4"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const bin_actions: ColumnDef<Contact>[] = [
    {
      id: "home_actions",
      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              icon="Lucide/refreshCcw"
              className="text-right font-medium h-8 w-8 p-0"
              onClick={() => {
                return submit(
                  { contactId: contact.id },
                  { method: "post", action: "?/recover" }
                );
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  icon="GoogleMaterial/elipsis"
                  className="text-right font-medium h-8 w-8"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="flex justify-between"
                  onClick={() => {
                    return submit(
                      { contactId: contact.id },
                      { method: "post", action: "?/delete" }
                    );
                  }}
                >
                  <span>Delete</span>
                  <Icon
                    name="Lucide/trash"
                    className="ml-2 h-4 w-4"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  let columns: ColumnDef<Contact>[] = [];

  if (route === "home") {
    columns = [
      ...fullname,
      ...email,
      ...phone,
      ...job,
      ...home_actions,
    ];
  } else if (route === "frequent") {
    columns = [
      ...fullname,
      ...email,
      ...phone,
      ...job,
      ...frequent_actions,
    ];
  } else if (route === "other") {
    columns = [
      ...fullname,
      ...email,
      ...phone,
      ...job,
      ...other_actions,
    ];
  } else if (route === "bin") {
    columns = [...fullname, ...bin_actions];
  }

  return <DataTable columns={columns} data={contacts} />;
}
