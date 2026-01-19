"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, Pencil, Save, X } from "lucide-react";
import { productAPI } from "@/app/types/api";
import { IProduct } from "@/app/types/stationaryInterface";
import { z } from "zod";
import { productSchema } from "@/app/types/validationSchemas";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [editableProduct, setEditableProduct] = useState<IProduct | null>(null);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await productAPI.getAll();
        const found = products.find((p: IProduct) => String(p.id) === id);
        setProduct(found || null);
        setEditableProduct(found || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (field: keyof IProduct, value: string | number) => {
    if (!editableProduct) return;

    setEditableProduct({
      ...editableProduct,
      [field]: value,
    });

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    if (!editableProduct) return false;

    try {
      const validatedData = productSchema.parse(editableProduct);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!editableProduct || !product?.id) return;

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const { id: productId, ...productData } = editableProduct;
      const updatedProduct = await productAPI.update(product.id, productData);

      setProduct(updatedProduct);
      setIsEditing(false);
      setErrors({});

      alert("Product updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditableProduct(product);
    setIsEditing(false);
    setErrors({});
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  const rating = 4.4;
  const reviewCount = 128;

  const colors = [
    { name: "Black", hex: "#000000" },
    { name: "Blue", hex: "#2563eb" },
    { name: "Red", hex: "#dc2626" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10 bg-white rounded-xl">
      {/* Image Section */}
      <div className="bg-gray-100 rounded-xl flex flex-col items-center justify-center p-6">
        {isEditing ? (
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <label className="font-medium block">Image URL</label>
              <input
                type="text"
                value={editableProduct?.image || ""}
                onChange={(e) => handleInputChange("image", e.target.value)}
                className={`w-full p-3 border rounded-lg ${
                  errors.image ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter image URL"
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}
            </div>

            {/* Image Preview */}
            <div className="mt-4 bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <Image
                src={editableProduct?.image || "/placeholder.jpg"}
                alt={editableProduct?.title || "Product"}
                width={300}
                height={300}
                className="object-contain mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                }}
              />
            </div>
          </div>
        ) : (
          <Image
            src={product.image}
            alt={product.title}
            width={400}
            height={400}
            className="object-contain"
          />
        )}
      </div>

      {/* Product Info Section */}
      <div className="space-y-6">
        {/* Title & Rating */}
        <div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editableProduct?.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`text-3xl font-semibold w-full p-3 border rounded-lg ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>
          ) : (
            <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
          )}

          <div className="flex items-center gap-4 mt-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating} ({reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-2">
                <span className="text-xl">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editableProduct?.price || 0}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  className={`text-3xl font-semibold w-full p-3 border rounded-lg ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>
          ) : (
            <span className="text-3xl font-semibold">${product.price}</span>
          )}
        </div>

        {/* Description */}
        <div>
          {isEditing ? (
            <div className="space-y-2">
              <label className="font-medium block">Description</label>
              <textarea
                value={editableProduct?.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={5}
                className={`w-full p-3 border rounded-lg ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-600 leading-relaxed">
              {product.description ||
                "High quality product with premium materials."}
            </p>
          )}
        </div>

        {/* Color Selection */}
        <div>
          <label className="font-medium block mb-3">
            Color: {colors[selectedColor].name}
          </label>
          <div className="flex gap-3">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(index)}
                className={`w-10 h-10 rounded-full border-2 ${
                  selectedColor === index
                    ? "border-black scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>

        {/* Size*/}
        <div>
          <label className="font-medium block mb-3">Size</label>
          <div className="grid grid-cols-6 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 border rounded-lg ${
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Edit button */}
        <div className="border-t pt-6 space-y-3 text-sm">
          <div className="flex justify-end gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gray-200 text-gray-800 px-5 py-3 rounded-lg shadow hover:bg-gray-300 transition disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg shadow hover:bg-gray-800 transition"
              >
                <Pencil className="w-4 h-4" />
                Edit Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
