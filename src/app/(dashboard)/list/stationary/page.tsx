"use client";

import { useState, useEffect } from "react";
import StationaryContainer from "@/app/components/StationaryContainer";
import TableSearch from "@/app/components/TableSearch";
import { role } from "@/lib/data";
import StationaryModal from "@/app/components/StationaryModal";
import { IProduct } from "@/app/types/stationaryInterface";
import { productAPI } from "@/app/types/api";

const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
      setError(null);
    } catch (error: any) {
      setError(error.message);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newProduct: IProduct) => {
    try {
      setIsSubmitting(true);
      const { id, ...productData } = newProduct;
      const createdProduct = await productAPI.create(productData);
      setProducts((prev) => [...prev, createdProduct]);
    } catch (error: any) {
      console.error("Create error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (updatedProduct: IProduct) => {
    if (!updatedProduct.id) return;

    try {
      setIsSubmitting(true);
      const { id, ...productData } = updatedProduct;
      const result = await productAPI.update(id!, productData);
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? result : p))
      );
    } catch (error: any) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsSubmitting(true);
      await productAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error("Delete error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex justify-between items-center pb-5">
        <h1 className="hidden md:block text-lg font-semibold">All Products</h1>

        <div className="flex gap-4 items-center">
          <TableSearch />

          {role === "admin" && (
            <StationaryModal type="create" onSubmit={handleCreate} />
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product: IProduct) => (
            <StationaryContainer
              key={product.id}
              product={product}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
