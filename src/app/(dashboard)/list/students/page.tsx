"use client";

import { useState } from "react";
import PageButton from "@/app/components/PageButton";
import TableSearch from "@/app/components/TableSearch";
import Table from "@/app/components/Table";
import FormModal from "@/app/components/FormModal";
import Image from "next/image";
import { role, studentsData } from "@/lib/data";

type Student = {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  grade: number;
  class: string;
  address: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
  { header: "Class", accessor: "class", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden md:table-cell" },
  { header: "Address", accessor: "address", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action", className: "hidden md:table-cell" },
];

const StudentListPage = () => {
  const [students, setStudents] = useState<Student[]>(studentsData);

  const handleCreate = (student: Student) => {
    setStudents((prev) => [student, ...prev]);
  };

  const handleUpdate = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDelete = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const renderRow = (item: Student) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 hover:bg-PurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.photo}
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

      <td className="hidden md:table-cell">{item.studentId}</td>
      <td className="hidden md:table-cell">{item.grade}</td>
      <td className="hidden md:table-cell">{item.class}</td>
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
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>

        <div className="flex gap-4 items-center">
          <TableSearch />
          {role === "admin" && (
            <FormModal table="student" type="create" onCreate={handleCreate} />
          )}
        </div>
      </div>

      <Table columns={columns} data={students} renderRow={renderRow} />
      <PageButton />
    </div>
  );
};

export default StudentListPage;
