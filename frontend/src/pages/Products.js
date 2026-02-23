import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);

  // ✅ Fetch products on page load
  useEffect(() => {
    API.get("products/")
      .then(res => {
        console.log("PRODUCTS:", res.data);
        setProducts(res.data);
      })
      .catch(err => console.log("API ERROR:", err));
  }, []);

  // ✅ Add to Cart function
  const addToCart = (productId) => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Login required ⚠️");
      return;
    }

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
      .then(() => alert("Added to cart 🛒"))
      .catch(err => {
        console.log("CART ERROR:", err);
        alert("Error adding to cart ❌");
      });
  };

  return (
    <div>
      <h2>Products</h2>

      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map(p => (
          <div key={p.id} style={{ marginBottom: "20px" }}>
            
            {/* ✅ Clickable Product */}
            <Link to={`/products/${p.id}`} style={{ textDecoration: "none", color: "black" }}>
              <h3>{p.name}</h3>
              <img src={p.image} width="150" alt={p.name} />
            </Link>

            <p>₹{p.price}</p>

            {/* ✅ Add to Cart */}
            <button onClick={() => addToCart(p.id)}>
              Add to Cart ➕🛒
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Products;