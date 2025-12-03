import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditJobPage = ({ setJobs }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    salary: "",
    company: {
      name: "",
      contactEmail: "",
      contactPhone: ""
    }
  });

  // Fetch existing job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error("Error fetching job:", err);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Convert salary to number if it's a number input
    const processedValue = type === "number" ? (value === "" ? "" : Number(value)) : value;

    if (name.startsWith("company.")) {
      const key = name.split(".")[1];
      setJob((prev) => ({
        ...prev,
        company: { ...prev.company, [key]: processedValue }
      }));
    } else {
      setJob((prev) => ({ ...prev, [name]: processedValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get token from localStorage (stored separately or in user object)
    const token = localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "null")?.token;
    if (!token) {
      alert("You must be logged in to edit a job.");
      navigate("/login");
      return;
    }

    try {
      console.log("Sending update request with job data:", job);
      console.log("Location value being sent:", job.location);
      
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job)
      });

      if (res.status === 401) {
        alert("You are not authorized to edit this job. Please log in again.");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to update job");

      const updatedJob = await res.json();
      
      console.log("Updated job from server:", updatedJob);
      console.log("Location value in updated job:", updatedJob.location);
      
      // Update the jobs list in App.jsx state
      if (setJobs) {
        setJobs((prev) =>
          prev.map((j) => {
            // Match by both _id and id (virtual field)
            const matches = String(j._id) === String(id) || String(j.id) === String(id);
            return matches ? updatedJob : j;
          })
        );
      }

      // Navigate with updated job data in state so JobPage can use it immediately
      const jobId = updatedJob._id || updatedJob.id || id;
      navigate(`/jobs/${jobId}`, { state: { updatedJob } });
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input name="title" value={job.title} onChange={handleChange} required />
        </div>

        <div>
          <label>Type</label>
          <input name="type" value={job.type} onChange={handleChange} required />
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" value={job.description} onChange={handleChange} required />
        </div>

        <div>
          <label>Location</label>
          <input name="location" value={job.location} onChange={handleChange} required />
        </div>

        <div>
          <label>Salary</label>
          <input type="number" name="salary" value={job.salary} onChange={handleChange} required />
        </div>

        <h3>Company Info</h3>
        <div>
          <label>Company Name</label>
          <input name="company.name" value={job.company.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Company Email</label>
          <input name="company.contactEmail" value={job.company.contactEmail} onChange={handleChange} required />
        </div>

        <div>
          <label>Company Phone</label>
          <input name="company.contactPhone" value={job.company.contactPhone} onChange={handleChange} required />
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>Update Job</button>
      </form>
    </div>
  );
};

export default EditJobPage;
