import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    // ✅ Redirect if not logged in
    if (!token) {
      alert("Please login first 🔐");
      navigate("/login");
      return;
    }

    // ✅ Fetch orders
    API.get("orders/history/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log("ORDERS:", res.data);
        setOrders(res.data.orders);
      })
      .catch(err => {
        console.log("ORDER ERROR:", err);
        alert("Failed to load orders ❌");
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders 📜</h2>

      {orders.length === 0 ? (
        <p>No orders placed yet 😢</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            {/* ✅ Order Header */}
            <Link to={`/invoice/${order.id}`}>
  <h3>Order #{order.id}</h3>
</Link>

            <p>
              <strong>Total:</strong> ₹{order.total_amount}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: "#e63946" }}>
                {order.status}
              </span>
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>

            <hr />

            {/* ✅ Order Items */}
            <h4>Items:</h4>

            {order.items.map(item => (
              <div
                key={item.id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #eee"
                }}
              >
                <p>
                  {item.product_name} × {item.quantity}
                </p>

                <p>
                  Price: ₹{item.price}
                </p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;