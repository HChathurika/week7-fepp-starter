import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      setUser(storedUser);
    };

    syncUser();
    window.addEventListener("userUpdated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("userUpdated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    if (setIsAuthenticated) setIsAuthenticated(false);
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/");
  };

  // Use isAuthenticated prop if provided, otherwise check user state
  const authenticated = isAuthenticated !== undefined ? isAuthenticated : !!user;

  return (
    <nav className="navbar" style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      borderBottom: "1px solid #ccc",
      backgroundColor: "#f8f8f8"
    }}>
      <h1 style={{ margin: 0 }}>Job Search</h1>
      <div className="links" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link to="/">Home</Link>
        {authenticated && <Link to="/add-job">Add Job</Link>}
        {!authenticated ? (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <span>Welcome, {user?.email || "User"}!</span>
            <button onClick={handleLogout} style={{ padding: "5px 10px" }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
