import JobListings from "../components/JobListings";

const HomePage = ({ jobs, setJobs, loading, setLoading }) => {
  return (
    <div className="home">
      <h1>All Jobs</h1>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <JobListings jobs={jobs} setJobs={setJobs} />
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  );
};

export default HomePage;
