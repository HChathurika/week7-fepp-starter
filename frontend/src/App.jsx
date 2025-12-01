import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages & Components
import HomePage from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import JobPage from "./pages/JobPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <Navbar />
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
            <Route path="/add-job" element={<AddJobPage setJobs={setJobs} />} />
            <Route path="/edit-job/:id" element={<EditJobPage setJobs={setJobs} />} />
            <Route path="/jobs/:id" element={<JobPage setJobs={setJobs} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
