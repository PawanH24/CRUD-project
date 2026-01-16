"use client";

import { useState } from "react";
import PageButton from "@/app/components/PageButton";
import TableSearch from "@/app/components/TableSearch";
import Table from "@/app/components/Table";
import FormModal from "@/app/components/FormModal";
import Image from "next/image";
import { role, teachersData } from "@/lib/data";

type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden md:table-cell" },
  { header: "Address", accessor: "address", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action", className: "hidden md:table-cell" },
];

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(teachersData);

  const handleCreate = (teacher: Teacher) => {
    setTeachers((prev) => [teacher, ...prev]);
  };

  const handleUpdate = (updated: Teacher) => {
    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDelete = (id: number) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 hover:bg-PurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src="/avatar.png"
          alt=""
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>

      <td className="hidden md:table-cell">{item.teacherId}</td>
      <td className="hidden md:table-cell">{item.subjects.join(", ")}</td>
      <td className="hidden md:table-cell">{item.classes.join(", ")}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>

      <td>
        <div className="flex gap-2">
          <FormModal
            table="teacher"
            type="update"
            data={item}
            onUpdate={handleUpdate}
          />

          {role === "admin" && (
            <FormModal
              table="teacher"
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
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>

        <div className="flex gap-4 items-center">
          <TableSearch />

          {role === "admin" && (
            <FormModal table="teacher" type="create" onCreate={handleCreate} />
          )}
        </div>
      </div>

      <Table columns={columns} data={teachers} renderRow={renderRow} />
      <PageButton />
    </div>
  );
};

export default TeacherListPage;
