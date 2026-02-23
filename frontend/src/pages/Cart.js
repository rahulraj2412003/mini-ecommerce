import { useEffect, useState } from "react";
import API from "../api/axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");

    API.get("cart/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log("CART DATA:", res.data);
        setCartItems(res.data.cart_items);
      })
      .catch(err => {
        console.log(err);
        alert("Please login first 🔐");
      });
  }, []);

  const removeItem = (itemId) => {
    const token = localStorage.getItem("access");

    API.delete(`cart/remove/${itemId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        alert("Item removed 🗑");
        setCartItems(prev => prev.filter(item => item.id !== itemId));
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Your Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p>Cart is empty 😢</p>
      ) : (
        cartItems.map(item => (
          <div key={item.id} style={{ marginBottom: "20px" }}>
            <img src={item.product_image} width="100" alt={item.product_name} />
            <h3>{item.product_name}</h3>
            <p>Price: ₹{item.product_price}</p>
            <p>Quantity: {item.quantity}</p>

            <button onClick={() => removeItem(item.id)}>
              Remove 🗑
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;