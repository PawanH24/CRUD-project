"use client";

import Image from "next/image";
import { useState } from "react";
import { z } from "zod";

type TableType = "teacher" | "student" | "parent" | "staff";

{
  /*scaling */
}
const tableFields: Record<
  TableType,
  { name: string; type?: "text" | "email" | "tel"; placeholder?: string }[]
> = {
  teacher: [
    { name: "teacherId", placeholder: "Teacher ID" },
    { name: "name", placeholder: "Name" },
    { name: "email", type: "email", placeholder: "Email" },
    { name: "phone", type: "tel", placeholder: "Phone" },
    { name: "subjects", placeholder: "Subjects" },
    { name: "classes", placeholder: "Classes" },
    { name: "address", placeholder: "Address" },
  ],
  student: [
    { name: "studentId", placeholder: "Student ID" },
    { name: "name", placeholder: "Name" },
    { name: "email", type: "email", placeholder: "Email" },
    { name: "phone", type: "tel", placeholder: "Phone" },
    { name: "grade", placeholder: "Grade" },
    { name: "class", placeholder: "Class" },
    { name: "address", placeholder: "Address" },
  ],
  parent: [
    { name: "parentId", placeholder: "Parent ID" },
    { name: "name", placeholder: "Name" },
    { name: "email", type: "email", placeholder: "Email" },
    { name: "phone", type: "tel", placeholder: "Phone" },
    { name: "address", placeholder: "Address" },
  ],
  staff: [
    { name: "staffId", placeholder: "Staff ID" },
    { name: "name", placeholder: "Name" },
    { name: "email", type: "email", placeholder: "Email" },
    { name: "phone", type: "tel", placeholder: "Phone" },
    { name: "address", placeholder: "Address" },
  ],
};

type Props = {
  table: TableType;
  type: "create" | "update" | "delete";
  id?: number;
  data?: any;
  onDelete?: (id: number) => void;
  onCreate?: (data: any) => void;
  onUpdate?: (data: any) => void;
};

const FormModal = ({
  table,
  type,
  id,
  data,
  onDelete,
  onCreate,
  onUpdate,
}: Props) => {
  const [open, setOpen] = useState(false);

  const fields = tableFields[table];

  const initialForm: Record<string, any> = {};
  fields.forEach((f) => (initialForm[f.name] = data?.[f.name] ?? ""));

  const [formData, setFormData] = useState<Record<string, any>>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<string>(data?.photo ?? "/avatar.png");

  const resetForm = () => {
    setFormData(initialForm);
    setErrors({});
    setPhoto("/avatar.png");
  };

  const fillForm = () => {
    if (!data) return;
    const filled: Record<string, any> = {};
    fields.forEach((f) => {
      filled[f.name] = data[f.name] ?? "";
    });
    setFormData(filled);
    setPhoto(data.photo ?? "/avatar.png");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const fieldErrors: Record<string, string> = {};
    fields.forEach((f) => {
      if (!formData[f.name])
        fieldErrors[f.name] = `${f.placeholder || f.name} is required`;
    });
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    const payload = { ...formData, id: data?.id ?? Date.now(), photo };

    if (type === "create") onCreate?.(payload);
    if (type === "update") onUpdate?.(payload);

    resetForm();
    setOpen(false);
  };

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-Yellow"
      : type === "update"
      ? "bg-Sky"
      : "bg-Purple";

  return (
    <>
      <button
        className={`${size} rounded-full ${bgColor} flex items-center justify-center`}
        onClick={() => {
          type === "update" ? fillForm() : resetForm();
          setOpen(true);
        }}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-[90%] md:w-[50%] relative">
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>

            {(type === "create" || type === "update") && (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  {type === "create" ? `Add ${table}` : `Edit ${table}`}
                </h2>

                {/* Photo Upload */}
                <div className="mb-4 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border mb-2">
                    <img
                      src={photo}
                      alt={`${table} photo`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="text-sm"
                  />
                </div>

                {/* Dynamic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <div key={field.name}>
                      <input
                        name={field.name}
                        type={field.type || "text"}
                        placeholder={field.placeholder || field.name}
                        className="border p-2 rounded w-full"
                        value={formData[field.name]}
                        onChange={handleChange}
                      />
                      {errors[field.name] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-Yellow rounded"
                  >
                    {type === "create" ? "Add" : "Update"}
                  </button>
                </div>
              </>
            )}

            {type === "delete" && id !== undefined && (
              <>
                <h2 className="text-lg font-semibold mb-6">
                  Are you sure you want to delete this {table}?
                </h2>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(id);
                      setOpen(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
