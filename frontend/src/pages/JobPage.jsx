import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const JobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const res = await fetch(`/api/jobs/${id}`);
      const data = await res.json();
      setJob(data);
    };
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    navigate("/jobs");
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Description:</strong> {job.description}</p>

      <h3>Company Info</h3>
      <p><strong>Name:</strong> {job.company?.name}</p>
      <p><strong>Email:</strong> {job.company?.contactEmail}</p>
      <p><strong>Phone:</strong> {job.company?.contactPhone}</p>

      <button onClick={handleDelete}>Delete Job</button>
    </div>
  );
};

export default JobPage;
