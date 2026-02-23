import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      alert("Login required 🔐");
      navigate("/login");
      return;
    }

    API.get("cart/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        const items = res.data.cart_items;
        setCartItems(items);

        const cartTotal = items.reduce(
          (sum, item) =>
            sum + item.quantity * parseFloat(item.product_price),
          0
        );

        setTotal(cartTotal);
      })
      .catch(err => console.log(err));
  }, []);

  const handlePayment = () => {
    if (paymentMethod === "CARD") {
      alert("Processing Card Payment 💳...");
      setTimeout(placeOrder, 1500);  // simulate delay
    } else {
      placeOrder(); // COD → direct
    }
  };

  const placeOrder = () => {
    API.post(
      "orders/place/",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => {
        alert("Payment successful & Order placed 🎉");
        navigate("/orders");
      })
      .catch(err => {
        console.log(err);
        alert("Checkout failed ❌");
      });
  };

  return (
    <div>
      <h2>Checkout 💳</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty 😢</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id}>
              <h3>{item.product_name}</h3>
              <p>₹{item.product_price} × {item.quantity}</p>
            </div>
          ))}

          <hr />

          <h3>Total: ₹{total.toFixed(2)}</h3>

          <h3>Select Payment Method</h3>

          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
          >
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="CARD">Credit / Debit Card 💳</option>
          </select>

          <br /><br />

          <button onClick={handlePayment}>
            Pay & Place Order ✅
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;