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

export function ContactList({ contacts }: { contacts: Contact[] }) {
  const navigate = useNavigate();
  const submit = useSubmit();

  const columns: ColumnDef<Contact>[] = [
    {
      id: "fullname",
      header: "Name",
      cell: ({ row }) => {
        const first = row.original.first_name;
        const last = row.original.last_name;
        return (
          <div className="flex">
            <p className="mr-1">{first}</p>
            <p className="text-gray-500">{last}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
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
    {
      id: "edit",
      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="text-right font-medium w-2">
            <Button
              variant="ghost"
              className="flex justify-center h-8 w-8 p-0"
              onClick={() => {
                return navigate(`/${contact.id}`);
              }}
            >
              <Icon name="Lucide/squarePen" className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="text-right font-medium w-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex justify-center h-8 w-8 p-0"
                >
                  <Icon
                    name="GoogleMaterial/elipsis"
                    className="h-4 w-4"
                  />
                </Button>
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
                  <span>Sil</span>
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

  return <DataTable columns={columns} data={contacts} />;
}
