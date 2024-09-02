import { ColumnDef } from "@tanstack/react-table";
import { Contact } from "~/components/types/contact";

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
      const job = row.original.job;
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
