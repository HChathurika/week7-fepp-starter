import { useParams, useNavigate, Link, useLoaderData } from "react-router-dom";

// Experiment: Using Loader instead of useEffect
// Loader function that fetches data before component renders
export const jobLoader = async ({ params }) => {
  try {
    const res = await fetch(`/api/jobs/${params.id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch job: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in jobLoader:", error);
    throw error;
  }
};

const JobPage = ({ deleteJob, isAuthenticated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Use loader data instead of useEffect + useState
  const job = useLoaderData();

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      await deleteJob(id);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete job");
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
