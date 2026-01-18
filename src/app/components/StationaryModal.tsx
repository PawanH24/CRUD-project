"use client";

import { useState } from "react";
import Image from "next/image";
import { z } from "zod";
import {
  IStationaryModalProps,
  IProduct,
  IFormErrors,
} from "@/app/types/stationaryInterface";
import { productSchema } from "@/app/types/validationSchemas";

const StationaryModal = ({
  type,
  data,
  onSubmit,
  onDelete,
}: IStationaryModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Omit<IProduct, "id">>({
    title: data?.title || "",
    price: data?.price || 0,
    image: data?.image || "",
  });
  const [errors, setErrors] = useState<IFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "price") {
      const numValue = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name as keyof IFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    try {
      const dataToValidate = {
        ...formData,
        price: Number(formData.price) || 0,
      };

      productSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: IFormErrors = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof IFormErrors] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (type === "delete") {
      if (data?.id !== undefined && onDelete) {
        setIsSubmitting(true);
        try {
          await onDelete(data.id);
          setOpen(false);
        } catch (error) {
          console.error("Delete failed:", error);
        } finally {
          setIsSubmitting(false);
        }
      }
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit({
          ...formData,
          id: data?.id ?? Date.now(),
        });
        setOpen(false);
        // Reset form
        setFormData({
          title: "",
          price: 0,
          image: "",
        });
        setErrors({});
      } catch (error) {
        console.error("Submit failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setErrors({});
    if (data) {
      setFormData({
        title: data.title || "",
        price: data.price || 0,
        image: data.image || "",
      });
    }
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
            ? "bg-red-400 p-2 rounded-md shadow"
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
              onClick={handleModalClose}
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
                    onClick={handleModalClose}
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

                <div className="space-y-2">
                  {/*name*/}
                  <div>
                    <input
                      name="title"
                      placeholder="Product title"
                      className={`border p-2 rounded w-full ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      value={formData.title}
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Price*/}
                  <div>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Price"
                      className={`border p-2 rounded w-full ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      }`}
                      value={formData.price || ""}
                      onChange={handleChange}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Image*/}
                  <div>
                    <input
                      name="image"
                      placeholder="Image URL"
                      className={`border p-2 rounded w-full ${
                        errors.image ? "border-red-500" : "border-gray-300"
                      }`}
                      value={formData.image}
                      onChange={handleChange}
                    />
                    {errors.image && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={handleModalClose}
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
