import { useEffect, useState } from "react";
import API from "../api/axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const token = localStorage.getItem("access");

  useEffect(() => {
    API.get("cart/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setCartItems(res.data.cart_items))
      .catch(err => console.log(err));
  }, []);

  const updateQuantity = (itemId, newQty) => {
    API.patch(
      `cart/update/${itemId}/`,
      { quantity: newQty },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => {
        console.log(res.data);

        if (newQty < 1) {
          setCartItems(prev => prev.filter(item => item.id !== itemId));
        } else {
          setCartItems(prev =>
            prev.map(item =>
              item.id === itemId ? { ...item, quantity: newQty } : item
            )
          );
        }
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

            <div>
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                ➖
              </button>

              <span style={{ margin: "0 10px" }}>
                {item.quantity}
              </span>

              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                ➕
              </button>
            </div>
            <a href="/checkout">
  <button>Proceed to Checkout 💳</button>
</a>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;