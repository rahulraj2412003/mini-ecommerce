import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // ✅ Customer Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");

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

  // ✅ Basic Validation
  const validateForm = () => {
    if (!name || !phone || !address || !city || !pincode) {
      alert("Please fill all delivery details ⚠️");
      return false;
    }

    if (phone.length < 10) {
      alert("Invalid phone number 📞");
      return false;
    }

    return true;
  };

  const handleCheckout = () => {
    if (!validateForm()) return;

    if (paymentMethod === "CARD") {
      alert("Processing Card Payment 💳...");
      setTimeout(placeOrder, 1500);
    } else {
      placeOrder();
    }
  };

  const placeOrder = () => {
    API.post(
      "orders/place/",
      {
        name,
        phone,
        address,
        city,
        pincode,
        payment_method: paymentMethod,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => {
        alert("Order placed successfully 🎉");
        navigate("/orders");
      })
      .catch(err => {
        console.log(err);
        alert("Checkout failed ❌");
      });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Checkout 💳📦</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty 😢</p>
      ) : (
        <>
          <h3>Order Summary</h3>

          {cartItems.map(item => (
            <div key={item.id}>
              <p>
                {item.product_name} × {item.quantity}
              </p>
            </div>
          ))}

          <h3>Total: ₹{total.toFixed(2)}</h3>

          <hr />

          <h3>Delivery Details 🚚</h3>

          <input
            placeholder="Full Name"
            onChange={e => setName(e.target.value)}
          /><br /><br />

          <input
            placeholder="Phone Number"
            onChange={e => setPhone(e.target.value)}
          /><br /><br />

          <textarea
            placeholder="Full Address"
            onChange={e => setAddress(e.target.value)}
          /><br /><br />

          <input
            placeholder="City"
            onChange={e => setCity(e.target.value)}
          /><br /><br />

          <input
            placeholder="Pincode"
            onChange={e => setPincode(e.target.value)}
          /><br /><br />

          <h3>Payment Method 💳</h3>

          <select onChange={e => setPaymentMethod(e.target.value)}>
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="CARD">Credit / Debit Card</option>
          </select>

          <br /><br />

          <button onClick={handleCheckout}>
            Pay & Place Order ✅
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;