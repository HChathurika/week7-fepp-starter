import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages & Components
import HomePage from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import JobPage from "./pages/JobPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") || !!localStorage.getItem("user")
  );

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  jobs={jobs}
                  setJobs={setJobs}
                  loading={loading}
                  setLoading={setLoading}
                />
              }
            />
            <Route
              path="/signup"
              element={<Signup setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/add-job"
              element={
                isAuthenticated ? (
                  <AddJobPage setJobs={setJobs} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/edit-job/:id"
              element={
                isAuthenticated ? (
                  <EditJobPage setJobs={setJobs} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/jobs/:id"
              element={<JobPage setJobs={setJobs} isAuthenticated={isAuthenticated} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
