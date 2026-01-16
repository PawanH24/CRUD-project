"use client";

import { useState } from "react";
import PageButton from "@/app/components/PageButton";
import TableSearch from "@/app/components/TableSearch";
import Table from "@/app/components/Table";
import FormModal from "@/app/components/FormModal";
import Image from "next/image";
import { role, parentsData } from "@/lib/data";

type Parent = {
  id: number;
  name: string;
  students: string[];
  phone: string;
  email?: string;
  address: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Student Names",
    accessor: "student",
    className: "hidden md:table-cell",
  },
  { header: "Phone", accessor: "phone", className: "hidden md:table-cell" },
  { header: "Address", accessor: "address", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action", className: "hidden md:table-cell" },
];

const ParentListPage = () => {
  const [parents, setParents] = useState<Parent[]>(parentsData);

  const handleCreate = (student: Parent) => {
    setParents((prev) => [student, ...prev]);
  };

  const handleUpdate = (updated: Parent) => {
    setParents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDelete = (id: number) => {
    setParents((prev) => prev.filter((s) => s.id !== id));
  };

  const renderRow = (item: Parent) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 hover:bg-PurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>

      <td className="hidden md:table-cell">{item.students.join(",")}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>

      <td>
        <div className="flex gap-2">
          <FormModal
            table="student"
            type="update"
            data={item}
            onUpdate={handleUpdate}
          />
          {role === "admin" && (
            <FormModal
              table="student"
              type="delete"
              id={item.id}
              onDelete={handleDelete}
            />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>

        <div className="flex gap-4 items-center">
          <TableSearch />
          {role === "admin" && (
            <FormModal table="student" type="create" onCreate={handleCreate} />
          )}
        </div>
      </div>

      <Table columns={columns} data={parents} renderRow={renderRow} />
      <PageButton />
    </div>
  );
};

export default ParentListPage;
