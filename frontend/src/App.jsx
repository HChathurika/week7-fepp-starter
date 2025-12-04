import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Pages & Components
import HomePage from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import JobPage, { jobLoader } from "./pages/JobPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") || !!localStorage.getItem("user")
  );

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) {
          throw new Error(`Failed to fetch jobs: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setJobs(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err.message || "Failed to fetch jobs. Make sure the backend server is running on port 4000.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Handler functions moved to App.jsx (Experiment: Handlers in App.jsx)
  const addJob = async (newJob) => {
    try {
      const token = localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "null")?.token;
      
      if (!token) {
        throw new Error("You must be logged in to add a job.");
      }

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newJob),
      });

      if (res.status === 401) {
        throw new Error("You are not authorized to add a job. Please log in again.");
      }

      if (!res.ok) {
        throw new Error("Failed to add job");
      }

      const createdJob = await res.json();
      setJobs((prev) => [...prev, createdJob]);
      return createdJob;
    } catch (err) {
      console.error("Error adding job:", err);
      throw err;
    }
  };

  const deleteJob = async (id) => {
    try {
      const token = localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "null")?.token;
      
      if (!token) {
        throw new Error("You must be logged in to delete a job.");
      }

      const res = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        throw new Error("You are not authorized to delete this job. Please log in again.");
      }

      if (!res.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs((prev) => prev.filter((j) => String(j._id) !== String(id) && String(j.id) !== String(id)));
    } catch (err) {
      console.error("Error deleting job:", err);
      throw err;
    }
  };

  const updateJob = async (id, updatedJob) => {
    try {
      const token = localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "null")?.token;
      
      if (!token) {
        throw new Error("You must be logged in to update a job.");
      }

      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedJob),
      });

      if (res.status === 401) {
        throw new Error("You are not authorized to edit this job. Please log in again.");
      }

      if (!res.ok) {
        throw new Error("Failed to update job");
      }

      const updated = await res.json();
      setJobs((prev) =>
        prev.map((j) => {
          const matches = String(j._id) === String(id) || String(j.id) === String(id);
          return matches ? updated : j;
        })
      );
      return updated;
    } catch (err) {
      console.error("Error updating job:", err);
      throw err;
    }
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}>
        <Route
          index
          element={
            <HomePage
              jobs={jobs}
              setJobs={setJobs}
              loading={loading}
              setLoading={setLoading}
              error={error}
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
              <AddJobPage addJob={addJob} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/edit-job/:id"
          element={
            isAuthenticated ? (
              <EditJobPage updateJob={updateJob} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/jobs/:id"
          element={<JobPage deleteJob={deleteJob} isAuthenticated={isAuthenticated} />}
          loader={jobLoader}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
