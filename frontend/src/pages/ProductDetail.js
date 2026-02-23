import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function ProductDetail() {
  const { id } = useParams();  // ✅ get URL param
  const [product, setProduct] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    API.get(`products/${id}/`)
      .then(res => {
        console.log("PRODUCT DETAIL:", res.data);
        setProduct(res.data);
      })
      .catch(err => console.log(err));
  }, [id]);

  const addToCart = () => {
    API.post(
      "cart/add/",
      {
        product_id: product.id,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => alert("Added to cart 🛒"))
      .catch(() => alert("Login required 🔐"));
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div>
      <h2>{product.name}</h2>

      <img src={product.image} width="250" alt={product.name} />

      <p><strong>Price:</strong> ₹{product.price}</p>
      <p><strong>Description:</strong> {product.description}</p>

      <button onClick={addToCart}>
        Add to Cart ➕🛒
      </button>
    </div>
  );
}

export default ProductDetail;