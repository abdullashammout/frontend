import { useState } from "react";
import { deleteProduct } from "../services/productApi";

export default function DeleteConfirmationModal({
  productToDelete,
  onClose,
  onDelete,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const confirmDelete = async () => {
    if (productToDelete) {
      setLoading(true);
      setError(null); // Reset error state
      try {
        await deleteProduct(productToDelete); // Call delete function with product ID
        onDelete(); // Refresh product list after deletion
      } catch (err) {
        console.error("Failed to delete product", err);
        setError("Failed to delete product. Please try again.");
      } finally {
        setLoading(false);
        onClose(); // Close the modal
      }
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
            <h5 className="modal-title">Confirm Deletion</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger">{error}</p>}
            <p>Are you sure you want to delete this product?</p>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={loading}
              className={`btn ${loading ? "btn-secondary" : "btn-danger"}`}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
