import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    API.post("token/", { username, password })
      .then(res => {
        console.log(res.data);

        // ✅ Save tokens
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);

        alert("Login successful ✅");

        navigate("/products");
      })
      .catch(err => {
        console.log(err);
        alert("Invalid credentials ❌");
      });
  };

  return (
    <div>
      <h2>Login 🔐</h2>

      <input
        type="text"
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;