import JobListings from "../components/JobListings";

const HomePage = ({ jobs, setJobs, loading, setLoading, error }) => {
  return (
    <div className="home">
      <h1>All Jobs</h1>
      {loading ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '4px', margin: '10px 0' }}>
          <p><strong>Error:</strong> {error}</p>
          <p style={{ fontSize: '0.9em', marginTop: '5px' }}>
            Please check:
            <ul style={{ marginTop: '5px' }}>
              <li>Is the backend server running on port 4000?</li>
              <li>Check the browser console for more details.</li>
            </ul>
          </p>
        </div>
      ) : jobs.length > 0 ? (
        <JobListings jobs={jobs} setJobs={setJobs} />
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  );
};

export default HomePage;
