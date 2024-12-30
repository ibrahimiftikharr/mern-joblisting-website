import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import '../css/employer-css/applications.css';

function Applications() {
  const token = localStorage.getItem('token');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employer/get-jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        console.error("array of jobs objs not received.");
      }
    } catch (err) {
      alert(err.response?.data?.error);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="applications">
      <h1>Job Applications</h1>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <JobItem key={job._id} job={job} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}

function JobItem({ job, token }) {
  return (
    <div className="job-card">
      <h2>{job.title}</h2>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>City:</strong> {job.city}</p>
      <p><strong>Country:</strong> {job.country}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p><strong>Job Type:</strong> {job.jobType}</p>
      <h3>Applications</h3>
      {job.applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        job.applications.map((application) => (
          <ApplicationDetails
            key={application.userId}
            application={application}
            jobId={job._id}
            token={token}
          />
        ))
      )}
    </div>
  );
}
function ApplicationDetails({ application, jobId, token }) {
  const [approvalStatus, setApprovalStatus] = useState('Awaiting Employer Response');
  const [interviewDate, setInterviewDate] = useState('');
  const [selectedCV, setSelectedCV] = useState(null);
  const [cvError, setCVError] = useState("");

  const fetchCV = async (cvId) => {
    try {
      const response = await axios.get(`http://localhost:5000/employer/fetch-cv/${cvId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data) {
        setSelectedCV(response.data);
        setCVError("");
      } else {
        setSelectedCV(null);
        setCVError("CV not found.");
      }
    } catch (err) {
      setSelectedCV(null);
      setCVError(err.response?.data?.error || "Failed to fetch CV.");
    }
  };

  const handleApproval = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/employer/give-approval/${jobId}/${application.userId}`,
        { approvalStatus, interviewDate },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert('Approval status updated');
      } else {
        alert('Failed to update approval status');
      }
    } catch (err) {
      console.error('Error updating approval:', err);
      alert('Error updating approval');
    }
  };

  const handleCloseCV = () => {
    setSelectedCV(null);
    setCVError(""); 
  };

  return (
   < div className="contain">
    <div className="application-card">
      <button onClick={() => fetchCV(application.userId)} className="view-cv-btn">View CV</button>
     
      {selectedCV && (
        <div className="cv-display">
          <h2>CV Details</h2>
          <p><strong>Name:</strong> {selectedCV.name}</p>
          <p><strong>Description:</strong> {selectedCV.description}</p>
          <button onClick={handleCloseCV} className="close-cv-btn">Close CV</button>
        </div>
      )}
      {cvError && <p className="error">{cvError}</p>}
      <div>
        <div>
          <strong >Approval Status</strong>
 
          <select value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)}>
            <option value="Awaiting Employer Response">Awaiting Employer Response</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <strong >Interview Date</strong>

          <input
            type="date"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />
        </div>
        <button onClick={handleApproval}>Update Approval</button>
      </div>
    </div>

    
    </div>
  
  );
}


export default Applications;