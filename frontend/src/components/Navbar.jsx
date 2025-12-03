import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
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
    setUser(null);
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/");
  };

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
        <Link to="/add-job">Add Job</Link>
        {!user ? (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <span>Welcome, {user.email}!</span>
            <button onClick={handleLogout} style={{ padding: "5px 10px" }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
