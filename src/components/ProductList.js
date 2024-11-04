"use client";
import { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { getProducts } from "../services/productApi";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res);
      setFilteredProducts(res);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleResetFilters = () => {
    setMinPrice();
    setMaxPrice();
    setCategoryFilter("");
    setAvailabilityFilter(null);
    setFilteredProducts(products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  const handleApplyFilters = () => {
    let filtered = products;

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) <= parseFloat(maxPrice)
      );
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter((product) =>
        product.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    // Filter by availability
    if (availabilityFilter !== null) {
      filtered = filtered.filter(
        (product) => Boolean(product.available) === availabilityFilter
      );
    }
    products.forEach((product) => {
      console.log(
        "Product availability:",
        product.available,
        "Type:",
        typeof product.available
      );
    });
    setFilteredProducts(filtered);
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="display-4 mb-4">Product Shop</h1>
      {/* Filter section */}
      <div className="mb-4 p-3 border rounded">
        <h2 className="h5 mb-3">Filter Products</h2>
        <div className="row mb-3">
          <div className="col-md-3">
            <input
              type="number"
              min={0}
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              min={0}
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-3 form-check">
            <input
              type="checkbox"
              checked={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.checked)}
              className="form-check-input"
              id="availabilityCheck"
            />
            <label className="form-check-label" htmlFor="availabilityCheck">
              Available
            </label>
          </div>
        </div>
        <button onClick={handleApplyFilters} className="btn btn-primary me-2">
          Apply Filters
        </button>
        <button onClick={handleResetFilters} className="btn btn-secondary">
          Reset Filters
        </button>
      </div>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="btn btn-success mb-4"
      >
        Add Product
      </button>
      <div className="row">
        {filteredProducts.length === 0 ? (
          <p className="text-muted">No products yet.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card border">
                <div className="card-body">
                  <h5 className="card-title">{product.name.toUpperCase()}</h5>
                  <p className="card-text">Category: {product.category}</p>
                  <p className="card-text">
                    Description: {product.description}
                  </p>
                  <p className="card-text">
                    Available: {product.available ? "yes" : "no"}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <p className="mb-0">Price: ${product.price.toFixed(2)}</p>
                  <div>
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn btn-warning me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={() => {
            // Handle delete logic here
            handleCloseDeleteModal();
          }}
          productId={productToDelete}
        />
      )}
      {isPopupOpen && (
        <ProductForm
          isEditing={!!selectedProduct}
          productData={selectedProduct}
          onClose={handleClosePopup}
          refreshProducts={fetchProducts}
        />
      )}
    </div>
  );
}
