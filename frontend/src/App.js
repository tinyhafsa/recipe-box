import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // react router for navigation

import { useEffect } from "react";

// import pages
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import RecipeBox from "./pages/RecipeBox/RecipeBox";
import Admin from "./pages/Admin/Admin";

import { applyTheme } from "./themes/applyTheme"; // function to apply saved theme


function App() {
  const user = JSON.parse(localStorage.getItem("user")); // get logged in user info from localStorage

  // apply theme from localStorage - defaults to beige
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "beige";
    applyTheme(savedTheme);
  }, []);

  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* if user is logged in, go to recipe box, else return to login page */}
        <Route path="/box" element={user ? <RecipeBox /> : <Navigate to="/login" />} />

        {/* admin only route */}
        <Route
          path="/admin"
          element={user?.isAdmin ? <Admin /> : <Navigate to="/" />}
        />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;