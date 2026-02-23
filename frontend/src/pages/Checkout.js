import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

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

  const handleCheckout = () => {
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
        console.log(res.data);

        alert("Order placed successfully 🎉");

        navigate("/products"); // Redirect after order
      })
      .catch(err => {
        console.log(err);

        if (err.response?.data?.error) {
          alert(err.response.data.error);
        } else {
          alert("Checkout failed ❌");
        }
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
              <p>
                ₹{item.product_price} × {item.quantity}
              </p>
            </div>
          ))}

          <hr />

          <h3>Total: ₹{total.toFixed(2)}</h3>

          <button onClick={handleCheckout}>
            Place Order ✅
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;