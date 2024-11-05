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
    <div className="container-fluid mt-5">
      <h1 className="display-4 mb-4 text-center">Product Shop</h1>
      <div className="mb-4 p-3 border rounded bg-light">
        {/* Filter Section */}
        <div className="row mb-3">
          <div className="col-12 col-md-3">
            <input
              type="number"
              min={0}
              placeholder="Min Price"
              className="form-control"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <input
              type="number"
              min={0}
              placeholder="Max Price"
              className="form-control"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <input
              type="text"
              placeholder="Category"
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="availabilityCheck"
              checked={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="availabilityCheck">
              Available
            </label>
          </div>
        </div>
        <div className="text-center">
          <button className="btn btn-primary me-2" onClick={handleApplyFilters}>
            Apply Filters
          </button>
          <button className="btn btn-secondary" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsPopupOpen(true)}
        className="btn btn-success mb-4"
      >
        Add Product
      </button>
      <div className="row">
        {filteredProducts.length === 0 ? (
          <p className="text-muted text-center">No products yet.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 mb-4">
              <div
                className="card border border-light shadow-lg h-100"
                style={{
                  transition: "transform 0.3s",
                  backgroundColor: "#f8f9fa",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="card-body">
                  <h5 className="card-title text-title">
                    {product.name.toUpperCase()}
                  </h5>
                  <p className="card-text text-secondary">
                    Category: {product.category}
                  </p>
                  <p className="card-text text-muted">
                    Description: {product.description}
                  </p>
                  <p className="card-text">
                    <span
                      className={`badge ${
                        product.available ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {product.available ? "Available" : "Out of Stock"}
                    </span>
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center bg-light">
                  <p className="mb-0 fw-bold text-dark">
                    Price: ${product.price.toFixed(2)}
                  </p>
                  <div>
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-danger btn-sm"
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
          onDelete={() => {
            // Handle delete logic here
            handleCloseDeleteModal();
            fetchProducts();
          }}
          productToDelete={productToDelete}
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
