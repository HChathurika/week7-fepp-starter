import JobListing from "./JobListing";

const JobListings = ({ jobs }) => {
  return (
    <div className="job-list">
      {jobs.map((job) => (
        <JobListing key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobListings;
