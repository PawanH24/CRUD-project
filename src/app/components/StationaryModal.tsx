"use client";

import { useState } from "react";
import Image from "next/image";

type Product = {
  id?: number;
  title: string;
  price: number;
  image: string;
};

type Props = {
  type: "create" | "update" | "delete";
  data?: Product;
  onSubmit?: (product: Product) => void;
  onDelete?: (id: number) => void;
};

const StationaryModal = ({ type, data, onSubmit, onDelete }: Props) => {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<Product>({
    title: data?.title || "",
    price: data?.price || 0,
    image: data?.image || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    // DELETE
    if (type === "delete") {
      if (data?.id !== undefined) {
        onDelete?.(data.id);
      }
      setOpen(false);
      return;
    }

    // CREATE / UPDATE
    onSubmit?.({
      ...formData,
      id: data?.id ?? Date.now(),
    });

    setOpen(false);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={`${
          type === "create"
            ? "w-8 h-8 bg-Yellow rounded-full"
            : type === "delete"
            ? "bg-red-500 p-2 rounded-md shadow"
            : "bg-gray-400 p-2 rounded-md shadow"
        } flex items-center justify-center`}
      >
        <Image
          src={`/${
            type === "create"
              ? "create"
              : type === "delete"
              ? "dustbin"
              : "update"
          }.png`}
          alt=""
          width={16}
          height={16}
        />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-md p-6 w-[90%] md:w-[400px] relative">
            <button
              className="absolute top-4 right-4"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </button>

            {type === "delete" ? (
              <>
                <h2 className="text-lg font-semibold mb-6">
                  Delete this product?
                </h2>

                <div className="flex justify-end gap-4">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded"
                    onClick={handleSubmit}
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  {type === "create" ? "Add Product" : "Edit Product"}
                </h2>

                <div className="space-y-4">
                  <input
                    name="title"
                    placeholder="Product title"
                    className="border p-2 rounded w-full"
                    value={formData.title}
                    onChange={handleChange}
                  />

                  <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    className="border p-2 rounded w-full"
                    value={formData.price}
                    onChange={handleChange}
                  />

                  <input
                    name="image"
                    placeholder="Image URL"
                    className="border p-2 rounded w-full"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-Yellow rounded"
                    onClick={handleSubmit}
                  >
                    {type === "create" ? "Add" : "Update"}
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

export default StationaryModal;
