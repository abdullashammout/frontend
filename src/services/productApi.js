const API_BASE_URL = "http://localhost:8080/api"; // Replace with your backend API base URL

// Fetch all products
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Fetch a single product
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch product with id ${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Failed to create product");
    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error);
  }
};

// Update an existing product
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error(`Failed to update product with id ${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete product with id ${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};
