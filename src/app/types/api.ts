import { IProduct } from "./stationaryInterface";

const API_BASE_URL =
  "https://a4d47a2e-ca39-4067-87ff-f1db77bb1a56.mock.pstmn.io/products"; // api crated in postman not dynamic static api.
// working api -https://fakestoreapi.com/products
export const productAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}?limit=10`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async create(product: Omit<IProduct, "id">) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  async update(id: number, product: Omit<IProduct, "id">) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return response.json();
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
  },
};
