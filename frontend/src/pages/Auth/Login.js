import { useState } from "react"; // manage form state
import axios from "axios"; // HTTP requests to backend
import { useNavigate } from "react-router-dom"; // redirect users after registration
import { Link } from "react-router-dom"; // navigation links
import './auth.css'; // CSS styling

function Login() {
  // state to store login values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // navigation hook
  const navigate = useNavigate();

  // function runs when form is submitted
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // send login request to backend
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // save user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: res.data.token,
          userId: res.data.userId,
          isAdmin: res.data.isAdmin,
        })
      );

      // redirect to correct page based on user role
      if (res.data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/box");
      }

    } catch (err) {
      // show error message
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth">
      <div className="auth-box">
        {/* heading */}
        <h1>Log In</h1>

        {/* form */}
        <form onSubmit={handleLogin}>

          {/* email */}
          <div className="email form-block">
            <label> Email </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* password */}
          <div className="password form-block">
            <label>Password</label>
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
          </div>

          {/* login button */}
          <button type="submit">Login</button>
        </form>

        {/* link to registation */}
        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
      </div>
    </div>
  );
}

// export
export default Login;