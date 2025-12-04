import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = ({ isAuthenticated, setIsAuthenticated }) => {
  return (
    <div className="App">
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
