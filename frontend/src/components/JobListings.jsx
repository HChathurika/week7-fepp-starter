import JobListing from "./JobListing";
import { Link } from "react-router-dom";

const JobListings = ({ jobs }) => {
  return (
    <div className="job-list">
      {jobs.map((job) => (
        <div key={job._id}>
          <JobListing job={job} />

          {/* View Job Button */}
          <Link to={`/jobs/${job._id}`}>View Job</Link>
        </div>
      ))}
    </div>
  );
};

export default JobListings;
