import { useState } from "react"; // manage form state
import axios from "axios"; // HTTP requests to backend
import { useNavigate } from "react-router-dom"; // redirect users after registration
import { Link } from "react-router-dom"; // navigation links
import './auth.css'; // CSS styling

function Register() {
  // state to store input values
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // function runs when form is submitted
  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    // send registration data to backend
    const res = await axios.post("http://localhost:5000/api/auth/register", {
      username,
      email,
      password
    });
    // save token and user ID in browser
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);

    // redirect after successful registration
    navigate("/box");

  } catch (err) {
    // show error message
    alert(err.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="auth">
      <div className="auth-box">
        {/* heading */}
        <h1>Sign Up</h1>

        {/* form */}
        <form onSubmit={handleRegister}>

          {/* username */}
          <div className="username form-block">
            <label>Username</label>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>

          {/* email */}
          <div className="email form-block">
            <label>Email</label>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          {/* password */}
          <div className="password form-block">
            <label>Password</label>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {/* submit button */}
          <button type="submit">Register</button>
        </form>

        {/* link to login */}
        <p>Already have an account? <Link to="/login">Log In</Link></p>
      </div>
    </div>
  );
}

// export
export default Register;
