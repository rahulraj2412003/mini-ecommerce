import { useEffect, useState } from "react";
import API from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  API.get("products/")
    .then(res => {
      console.log("API DATA:", res.data);  // 👈 ADD
      setProducts(res.data);
    })
    .catch(err => console.log("API ERROR:", err));
}, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
          <img src={p.image} width="150" alt={p.name} />
        </div>
      ))}
    </div>
  );
}

export default Products;