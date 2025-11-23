import React from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  if (!products || products.length === 0) {
    return <div className="small">No products found.</div>;
  }
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p._id || p.id || p.name} product={p} />
      ))}
    </div>
  );
}
