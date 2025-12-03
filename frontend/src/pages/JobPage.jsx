import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";

const JobPage = ({ setJobs, isAuthenticated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);

  useEffect(() => {
    // If we have updated job data from navigation state, use it immediately
    if (location.state?.updatedJob) {
      console.log("Using updated job from location state:", location.state.updatedJob);
      setJob(location.state.updatedJob);
      // Clear the state to prevent stale data on refresh
      window.history.replaceState({}, document.title);
    }

    // Always refetch to ensure we have the latest data from the server
    // Add cache-busting parameter to prevent browser caching
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}?t=${Date.now()}`);
        const data = await res.json();
        console.log("Fetched job from API:", data);
        console.log("Location value from API:", data.location);
        setJob(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
  }, [id, location.state]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "null")?.token;

      if (!token) {
        alert("You must be logged in to delete a job.");
        navigate("/login");
        return;
      }

      const res = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        alert("You are not authorized to delete this job. Please log in again.");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to delete job");
      }

      // Jobs coming from Mongo use "_id" or "id" (virtual field)
      setJobs((prev) => prev.filter((j) => String(j._id) !== String(id) && String(j.id) !== String(id)));
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>{job.title}</h2>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary}</p>

      <h3>Company Info</h3>
      <p><strong>Name:</strong> {job.company?.name}</p>
      <p><strong>Email:</strong> {job.company?.contactEmail}</p>
      <p><strong>Phone:</strong> {job.company?.contactPhone}</p>

      {isAuthenticated && (
        <div style={{ marginTop: "20px" }}>
          <Link to={`/edit-job/${job._id || job.id}`}>
            <button>Edit Job</button>
          </Link>
          <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
            Delete Job
          </button>
        </div>
      )}
    </div>
  );
};

export default JobPage;
