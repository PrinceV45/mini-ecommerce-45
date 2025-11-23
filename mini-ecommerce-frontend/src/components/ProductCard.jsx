import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h3 style={{margin:0}}>{product.name}</h3>
          <div className="small">₹{product.price.toFixed(2)}</div>
        </div>
        <div className="small" style={{marginTop:6}}>{product.category}</div>
      </div>
    </div>
  );
}
