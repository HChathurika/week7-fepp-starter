import { useEffect, useState } from "react";
import JobListings from "../components/JobListings";

const HomePage = () => {
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
    <div className="home">
      <h1>All Jobs</h1>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <JobListings jobs={jobs} />
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  );
};

export default HomePage;
