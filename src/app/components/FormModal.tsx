"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { z } from "zod";

/* ---------------- ZOD SCHEMA ---------------- */

const teacherSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  subjects: z.string().min(1, "Subjects are required"),
  classes: z.string().min(1, "Classes are required"),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

/* ---------------- PROPS ---------------- */

type Props = {
  table: "teacher" | "student" | "parent";
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

  const [formData, setFormData] = useState<TeacherFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    subjects: "",
    classes: "",
  });

  const [errors, setErrors] = useState<Partial<TeacherFormData>>({});

  /* ---------------- HELPERS ---------------- */

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      subjects: "",
      classes: "",
    });
    setErrors({});
  };

  const fillForm = () => {
    if (!data) return;

    setFormData({
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      address: data.address ?? "",
      subjects: data.subjects?.join(", ") ?? "",
      classes: data.classes?.join(", ") ?? "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = () => {
    const result = teacherSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<TeacherFormData> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof TeacherFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const payload = {
      id: data?.id ?? Date.now(),
      teacherId:
        data?.teacherId ??
        `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      subjects: formData.subjects.split(",").map((s) => s.trim()),
      classes: formData.classes.split(",").map((c) => c.trim()),
      photo: "/avatar.png",
    };

    if (type === "create") onCreate?.(payload);
    if (type === "update") onUpdate?.(payload);

    resetForm();
    setOpen(false);
  };

  /* ---------------- UI ---------------- */

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
                  {type === "create" ? "Add Teacher" : "Edit Teacher"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    [
                      "name",
                      "email",
                      "phone",
                      "address",
                      "subjects",
                      "classes",
                    ] as const
                  ).map((field) => (
                    <div key={field}>
                      <input
                        name={field}
                        placeholder={
                          field === "subjects"
                            ? "Subjects (comma separated)"
                            : field === "classes"
                            ? "Classes (comma separated)"
                            : field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        className="border p-2 rounded w-full"
                        value={formData[field]}
                        onChange={handleChange}
                      />
                      {errors[field] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[field]}
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
