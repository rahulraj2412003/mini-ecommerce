import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      alert("Login required 🔐");
      navigate("/login");
      return;
    }

    API.get("orders/history/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        const foundOrder = res.data.orders.find(o => o.id === parseInt(id));

        if (!foundOrder) {
          alert("Order not found ❌");
          navigate("/orders");
          return;
        }

        setOrder(foundOrder);
      })
      .catch(err => console.log(err));
  }, [id]);

  if (!order) return <p>Loading invoice...</p>;

  return (
    <div style={styles.container}>
      <h2>Invoice 🧾</h2>

      <div style={styles.section}>
        <p><strong>Order ID:</strong> #{order.id}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </div>

      <hr />

      <h3>Items</h3>

      {order.items.map(item => (
        <div key={item.id} style={styles.itemRow}>
          <p>{item.product_name}</p>
          <p>₹{item.price} × {item.quantity}</p>
          <p>
            ₹{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      ))}

      <hr />

      <h3>Total: ₹{parseFloat(order.total_amount).toFixed(2)}</h3>

      <button onClick={() => window.print()}>
        Print Invoice 🖨
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "white",
  },
  section: {
    marginBottom: "10px",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
};

export default Invoice;