import { DataTable } from "~/components/custom/data-table";
import { columns } from "~/lib/columns/contacts";

const contacts = [
  {
    id: 1,
    name: "John Doe",
    email: "test@test.com",
    phone: "123-456-7890",
  },
];

export default function Example() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-normal text-gray-500 leading-6">
            Contacts
          </h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <DataTable columns={columns} data={contacts} />
          </div>
        </div>
      </div>
    </div>
  );
}
