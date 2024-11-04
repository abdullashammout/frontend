import React from "react";
import ProductList from "./components/ProductList";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Product Dashboard</h1>
      <ProductList />
    </div>
  );
}

export default App;
