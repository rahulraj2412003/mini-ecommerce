import { useEffect, useState } from "react";
import API from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("products/")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  const addToCart = (productId) => {
    const token = localStorage.getItem("access"); // JWT token

    API.post(
      "cart/add/",
      {
        product_id: productId,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => alert("Added to cart 🛒"))
      .catch(err => {
        console.log(err);
        alert("Login required ⚠️");
      });
  };

  return (
    <div>
      <h2>Products</h2>

      {products.map(p => (
        <div key={p.id} style={{ marginBottom: "20px" }}>
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
          <img src={p.image} width="150" alt={p.name} />

          <br />

          <button onClick={() => addToCart(p.id)}>
            Add to Cart ➕🛒
          </button>
        </div>
      ))}
    </div>
  );
}

export default Products;