import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("products/")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

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
      .catch(err => console.log(err));
  };

  return (
    <div className="products-page">
      <h2>Our Products 🛍</h2>

      <div className="products-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            
            <Link to={`/products/${p.id}`}>
              <img src={p.image} alt={p.name} />
              <h3>{p.name}</h3>
            </Link>

            <p className="price">₹{p.price}</p>

            <button onClick={() => addToCart(p.id)}>
              Add to Cart ➕🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;