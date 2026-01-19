"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { productAPI } from "@/app/types/api";
import { IProduct } from "@/app/types/stationaryInterface";

const ProductDetailPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await productAPI.getAll();
        const found = products.find((p: IProduct) => String(p.id) === id);
        setProduct(found || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: Image */}
        <div className="bg-gray-100 rounded-lg flex items-center justify-center p-6">
          <Image
            src={product.image}
            alt={product.title}
            width={450}
            height={450}
            className="object-contain"
          />
        </div>

        {/* RIGHT: Details */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500">★★★★★</span>
            <span className="text-sm text-gray-500">(128 reviews)</span>
          </div>

          <p className="text-2xl font-bold mb-4">${product.price}</p>

          <p className="text-gray-600 mb-6">
            Premium quality product designed for comfort and durability. Perfect
            for daily use with long-lasting materials.
          </p>

          {/* Size */}
          <div className="mb-4">
            <p className="font-medium mb-2">Size</p>
            <div className="flex gap-2">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className="border px-4 py-1 rounded hover:bg-black hover:text-white"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-4">
              <button className="border px-3 py-1">-</button>
              <span>1</span>
              <button className="border px-3 py-1">+</button>
            </div>
          </div>

          <button className="w-full bg-black text-white py-3 rounded-md">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
