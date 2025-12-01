import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const JobPage = ({ setJobs }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      setJobs((prev) => prev.filter((j) => j.id !== id));
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

      <div style={{ marginTop: "20px" }}>
        <Link to={`/edit-job/${job.id}`}>
          <button>Edit Job</button>
        </Link>
        <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
          Delete Job
        </button>
      </div>
    </div>
  );
};

export default JobPage;
