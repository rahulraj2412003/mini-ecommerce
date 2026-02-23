import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#222", color: "white" }}>
      <Link to="/" style={{ marginRight: "10px", color: "white" }}>Home</Link>
      <Link to="/products" style={{ marginRight: "10px", color: "white" }}>Products</Link>
      <Link to="/cart" style={{ color: "white" }}>Cart</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navbar;