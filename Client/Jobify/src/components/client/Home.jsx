import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import '../css/jobseeker-css/home.css'

function Home()
{
  const token = localStorage.getItem('token');
  const [showPopup, setShowPopup] = useState(false);
  const [jobsList, setJobsList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);  

  
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jobseeker/fetch-all-jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setJobsList(response.data); 
      } catch (err) {
        alert(err.response?.data?.error || err.message);
        console.log(err);
      }
    };
  
    useEffect(() => {
      fetchJobs();
    }, [token]);
  
    const handleOpenPopup = (job) => {
      setSelectedJob(job);  
      setShowPopup(true);   
    };
  
    const handleClosePopup = () => {
      setShowPopup(false);  
      setSelectedJob(null);  
    };
     
    return(
      <div className="contain">

       <section className="all-jobs-container">
          <h1>All Jobs</h1>
          <ul className="jobsList">
            {jobsList.map((jobObj) => (
              <li key={jobObj._id}>
                <span className="job-title">{jobObj.title}</span>
                <hr />
                <span>
                    <strong>Location: </strong>
                    {jobObj.city}, {jobObj.country}
                </span>

                <span>
                    <strong>Salary: </strong>
                    {jobObj.salary}
                </span>

                <span>
                    <strong>Company: </strong>
                    {jobObj.company}
                </span>

                <span>
                    <strong>Job Type: </strong>
                    {jobObj.jobType}
                </span>

                <span>
                    <strong>Posted on: </strong>
                    {jobObj.datePosted.split('T')[0]}
                </span>

                <hr />
                <button className="job-button" onClick={() => handleOpenPopup(jobObj)}>View Job</button> {/* Pass selected job */}
              </li>
            ))}
          </ul>
        </section>

        {showPopup && (<JobView job={selectedJob} handleClosePopup={handleClosePopup} token={token} />)}


        </div>

    )

}


function JobView({ job, handleClosePopup, token }) {
  
  const applyJob = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/jobseeker/apply-job/${job._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } } 
      );

      alert(response.data.message);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
      console.log(err);
    }
  };

  if (!job) return null;

  return (
    <div className="popup-overlay" onClick={handleClosePopup}>
      <div className="popup">
        <h2>{job.title}</h2>
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <p><strong>Date Posted:</strong> {new Date(job.datePosted).toLocaleDateString()}</p>
        <p><strong>City:</strong> {job.city}</p>
        <p><strong>Country:</strong> {job.country}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <p><strong>Job Type:</strong> {job.jobType}</p>
        <button onClick={handleClosePopup}>Close</button>
        <button onClick={applyJob}>Apply</button>
      </div>
    </div>
  );
}



export default Home;