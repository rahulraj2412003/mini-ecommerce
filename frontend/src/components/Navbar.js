import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("access");

  const handleLogout = () => {
    // ✅ Remove tokens
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    alert("Logged out successfully 👋");

    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#222", color: "white" }}>
      <Link to="/" style={{ marginRight: "10px", color: "white" }}>Home</Link>
      <Link to="/products" style={{ marginRight: "10px", color: "white" }}>Products</Link>
      <Link to="/cart" style={{ marginRight: "10px", color: "white" }}>Cart</Link>

      {isLoggedIn ? (
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Logout 🔐
        </button>
      ) : (
        <Link to="/login" style={{ marginLeft: "10px", color: "white" }}>
          Login
        </Link>
      )}
    </nav>
  );
}

export default Navbar;