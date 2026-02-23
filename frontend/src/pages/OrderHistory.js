import { useEffect, useState } from "react";
import API from "../api/axios";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    API.get("orders/history/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log("ORDERS:", res.data);
        setOrders(res.data.orders);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>My Orders 📜</h2>

      {orders.length === 0 ? (
        <p>No orders yet 😢</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ marginBottom: "20px" }}>
            <h3>Order #{order.id}</h3>
            <p>Total: ₹{order.total_amount}</p>
            <p>Date: {new Date(order.created_at).toLocaleString()}</p>

            <h4>Items:</h4>
            {order.items.map(item => (
              <div key={item.id}>
                <p>
                  {item.product_name} × {item.quantity}
                </p>
              </div>
            ))}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;