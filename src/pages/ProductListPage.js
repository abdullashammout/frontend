// src/pages/ProductListPage.js
import React, { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "../services/productApi";
import ProductList from "../components/ProductList";

function ProductListPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div>
      <h2>Product List</h2>
      <ProductList products={products} onDelete={handleDelete} />
    </div>
  );
}

export default ProductListPage;
