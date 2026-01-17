"use client";

import { useState, useEffect } from "react";
import StationaryContainer from "@/app/components/StationaryContainer";
import TableSearch from "@/app/components/TableSearch";
import { role } from "@/lib/data";
import FormModal from "@/app/components/FormModal";
import StationaryModal from "@/app/components/StationaryModal";

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from FakeStoreAPI
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Convert to JSON
      })
      .then((data) => {
        setProducts(data); // Save data to state
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        console.error("Fetch error:", error);
      });
  }, []); // Empty array means run once when component loads

  const handleUpdate = (updatedProduct: any) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
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
            <StationaryModal
              type="create"
              onSubmit={(newProduct) =>
                setProducts((prev) => [...prev, newProduct])
              }
            />
          )}
        </div>
      </div>
      {/* Grid Layout - 5 items per row on large screens */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <StationaryContainer
              key={product.id} // Important: unique key for each item
              product={product} // Pass the whole product object
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
