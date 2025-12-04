import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Experiment: Handler passed as prop from App.jsx instead of defined here
const AddJobPage = ({ addJob }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("company.")) {
      const key = name.split(".")[1];
      setJob((prev) => ({
        ...prev,
        company: { ...prev.company, [key]: value }
      }));
    } else {
      setJob((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addJob(job);
      navigate("/"); // go back to job list
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add job");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Add New Job</h2>
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
        <button type="submit">Add Job</button>
      </form>
    </div>
  );
};

export default AddJobPage;
