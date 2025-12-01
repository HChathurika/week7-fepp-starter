import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";
import { useState } from "react";
import JobPage from "./pages/JobPage";

const App = () => {
  const [jobs, setJobs] = useState([]); // central jobs state

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home jobs={jobs} setJobs={setJobs} />} />
            <Route path="/add-job" element={<AddJobPage setJobs={setJobs} />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/jobs/:id" element={<JobPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
