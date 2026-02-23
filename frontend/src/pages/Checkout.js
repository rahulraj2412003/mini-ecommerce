import { useEffect, useState } from "react";
import API from "../api/axios";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const token = localStorage.getItem("access");

  useEffect(() => {
    API.get("cart/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        const items = res.data.cart_items;
        setCartItems(items);

        // ✅ Calculate total
        const cartTotal = items.reduce(
          (sum, item) => sum + item.quantity * parseFloat(item.product_price),
          0
        );

        setTotal(cartTotal);
      })
      .catch(err => console.log(err));
  }, []);

  const handleCheckout = () => {
    alert("Order placed successfully 🎉 (mock)");
  };

  return (
    <div>
      <h2>Checkout 💳</h2>

      {cartItems.map(item => (
        <div key={item.id}>
          <h3>{item.product_name}</h3>
          <p>₹{item.product_price} × {item.quantity}</p>
        </div>
      ))}

      <hr />

      <h3>Total: ₹{total.toFixed(2)}</h3>

      <button onClick={handleCheckout}>
        Place Order ✅
      </button>
    </div>
  );
}

export default Checkout;