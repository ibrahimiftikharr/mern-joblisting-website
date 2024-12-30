import React, { useState, useEffect } from "react";
import axios from "axios";
import '../css/jobseeker-css/myapplications.css';

function MyApplications() {
    const token = localStorage.getItem('token');
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [applyerId, setApplyerId] = useState("");

    useEffect(() => {
        if (token) {
            fetchAppliedJobs();
        }
    }, [token]);

    const fetchAppliedJobs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/jobseeker/applied-jobs', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data) {
                setAppliedJobs(response.data.AppliedJobs || []);
                setApplyerId(response.data.ApplyerID || "");
                console.log("FETCHED DATA:",response.data.ApplyerID);
            }
        } catch (err) {
            alert(err.response?.data?.error || err.message);
            console.error(err);
        }
    };

    const deleteJob = async (jobID) => {
        try {
            const response = await axios.delete(`http://localhost:5000/jobseeker/remove-application/${jobID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(response.data.message);
            setAppliedJobs(appliedJobs.filter((job) => job._id !== jobID));
        } catch (err) {
            alert(err.response?.data?.error || err.message);
            console.error(err);
        }
    };

    const Details = ({ job }) => {
        console.log("THIS IS JOB:",job.applications)
        console.log("APPLYER ID:",applyerId)
        const application = job.applications?.find(
            (app) => app.userId?.toString() === applyerId.toString()
        );

        const approvalStatus = application?.approvalStatus || "Undecided";
        const interviewDate = application?.interviewDate || "Undecided";

        return (
            <div>
                <p><strong>Approval Status:</strong> {approvalStatus}</p>
                <p><strong>Interview Date:</strong> {interviewDate}</p>
            </div>
        );
    };

    return (
        <div className="parent">
            <h3>Your Applications</h3>
            <ul>
                {appliedJobs.map((job) => (
                    <li key={job._id}>
                        <p><strong>Title:</strong> {job.title}</p>
                        <p><strong>Description:</strong> {job.description}</p>
                        <p><strong>City:</strong> {job.city}</p>
                        <p><strong>Country:</strong> {job.country}</p>
                        <p><strong>Salary:</strong> {job.salary}</p>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Job Type:</strong> {job.jobType}</p>
                        <Details job={job} />
                        <div className="btn-center">
                            <button onClick={() => deleteJob(job._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyApplications;
