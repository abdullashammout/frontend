import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../services/productApi";

export default function ProductForm({
  isEditing,
  productData,
  onClose,
  refreshProducts,
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && productData) {
      setName(productData.name);
      setPrice(productData.price);
      setCategory(productData.category);
      setDescription(productData.description);
      setAvailable(productData.available);
    }
  }, [isEditing, productData]);

  const validateForm = () => {
    const newErrors = {};
    // Name validation
    if (!name.trim()) newErrors.name = "Product name is required.";
    else if (!/^[A-Za-z\s]+$/.test(name))
      newErrors.name = "Product name should only contain letters.";

    // Price validation
    if (!price || isNaN(price) || price <= 0)
      newErrors.price = "Product price is required.";
    else if (!/^[0-9\s]+$/.test(price))
      newErrors.price = "Price should contain only positive numbers.";

    // Category validation
    if (!category.trim()) newErrors.category = "Category is required.";
    else if (!/^[A-Za-z0-9\s]+$/.test(category))
      newErrors.category = "Category should contain only letters and numbers.";

    // Description validation
    if (description && !/^[A-Za-z0-9\s]+$/.test(description)) {
      newErrors.description =
        "Description should only contain letters and numbers.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return; // Stop if form is invalid

    const product = {
      name,
      price: parseFloat(price),
      category,
      description,
      available,
    };
    try {
      if (isEditing) {
        await updateProduct(productData.id, product);
      } else {
        await createProduct(product);
      }
      console.log("Create product response:", product); // Log the response

      refreshProducts();
      onClose();
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        backend: error.response
          ? error.response.data.message
          : "An error occurred. Please try again.",
      }));
      console.log(error.message);
    }
  };

  return (
    <div
      className="modal d-block bg-secondary bg-opacity-50"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing ? "Edit Product" : "Add Product"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {errors.backend && <p className="text-danger">{errors.backend}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Product Name"
                  maxLength={30}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                />
                {errors.name && <p className="text-danger">{errors.name}</p>}
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  min={0.0}
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-control"
                />
                {errors.price && <p className="text-danger">{errors.price}</p>}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                />
                {errors.category && (
                  <p className="text-danger">{errors.category}</p>
                )}
              </div>

              <div className="mb-3">
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                />
                {errors.description && (
                  <p className="text-danger">{errors.description}</p>
                )}
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={() => setAvailable(!available)}
                  className="form-check-input"
                />
                <label className="form-check-label">Available</label>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                {isEditing ? "Update" : "Add"} Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
