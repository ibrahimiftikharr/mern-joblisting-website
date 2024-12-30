import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import '../css/employer-css/myjobs.css'
import validateInput  from "../shared/regex";

function MyJobs()
{
  const token=localStorage.getItem('token');
  const [jobs,setJobs]=useState([])


  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employer/get-jobs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.message) {
        alert(response.data.message);
        setJobs([]); 
      } 
      else 
      {
        setJobs(response.data);
      }
    } catch (err) {
      alert('Failed to fetch jobs');
      console.error('Error fetching jobs:', err.message, err.response?.data);
    }
  };

  useEffect(()=>{
    if(token)
    {
       fetchJobs();
    }
  },[token])

  
  const deleteJob=async(jobId)=>{
    try{
          const response= await axios.delete(`http://localhost:5000/employer/delete-job/${jobId}`,{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          alert(response.data.message);
          const filtered=jobs.filter((obj)=>{
            return obj._id!==jobId
          })
          setJobs(filtered)

    }
    catch(err)
    {
          console.log(err);
          alert(err?.response?.data?.error || err.message)
    }

 }

 
  
  const [selectedJob, setSelectedJob]=useState(null);

  
  return(
     
    <div className="full-container" >
      <h3>Your Jobs</h3>
       {
          
          jobs.length===0?(<div>No jobs uploaded by you</div>):(
           
            <div className="jobs-displayer"> 
                {
                     jobs.map((obj,index)=>{

                      return(
                          <div key={index} className="job-details">
                               <div>
                                  <strong>Job Title</strong>
                                   <p>{obj.title}</p>
                               </div>

                               <div>
                                  <strong>City</strong>
                                   <p>{obj.city}</p>
                               </div>

                               <div>
                                  <strong>Country</strong>
                                   <p>{obj.country}</p>
                               </div>

                               <div>
                                  <strong>Salary</strong>
                                   <p>{obj.salary}</p>
                               </div>

                               <div>
                                  <strong>Company</strong>
                                   <p>{obj.company}</p>
                               </div>

                               <div>
                                  <strong>Job Type</strong>
                                   <p>{obj.jobType}</p>
                               </div>

                               <div>
                                  <strong>Date Posted</strong>
                                   <p>{obj.datePosted.split('T')[0]}</p>
                               </div>

                               <div>
                                  <button onClick={()=>deleteJob(obj._id)}>
                                      Delete Job
                                  </button>
                               </div>

                               <div>
                                  <button onClick={()=>setSelectedJob(obj)}>
                                      Select for Update
                                  </button>
                               </div>
                          </div>
          
                      )
          
                    })
                }

            </div>

          )
         
       }

       { selectedJob && ( <UpdateJob token={token}  updateJob={selectedJob}/>)}

   </div>
   
   

  )


}

function UpdateJob({ token, updateJob }) {
  const [input, setInput] = useState(updateJob);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const [errors,setErrors]=useState({title:'', description:'', salary:''})

  useEffect(() => {
    setInput(updateJob);
  }, [updateJob]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const titleError=validateInput('title',input.title);
      const descriptionError=validateInput('description',input.description);
      const salaryError=validateInput('salary',input.salary);

      if(titleError || descriptionError || salaryError)
      {
         setErrors({title: titleError, description: descriptionError, salary: salaryError})
         return;
      }

      const response = await axios.put(`http://localhost:5000/employer/update-job/${updateJob._id}`, input, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert(response.data.message);
    } catch (err) {
      alert(err?.response?.data?.error || err.message);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="update-job-form">
      <h4>Update Job</h4>
      <div>
        <label>Title</label>
        <input type="text" name="title" value={input.title} onChange={handleChange} required />
      </div>
      {errors.title && (<p className="error">{errors.title}</p>)}

      <div>
        <label>City</label>
        <input type="text" name="city" value={input.city} onChange={handleChange} required />
      </div>
      <div>
        <label>Country</label>
        <input type="text" name="country" value={input.country} onChange={handleChange} required />
      </div>
      <div>
        <label>Salary</label>
        <input type="text" name="salary" value={input.salary} onChange={handleChange} required />
      </div>
      {errors.salary && (<p className="error">{errors.salary}</p>)}

      <div>
        <label>Company</label>
        <input type="text" name="company" value={input.company} onChange={handleChange} required />
      </div>
      <div>
        <label>Job Type</label>
        <input type="text" name="jobType" value={input.jobType} onChange={handleChange} required />
      </div>

      <div>
        <label>Description</label>
      </div>
      <div><textarea rows={10} columns={10} type="text" name="description" value={input.description} onChange={handleChange} required ></textarea></div>
      {errors.description && (<p className="error">{errors.description}</p>)}
     
      <button type="submit">Update Job</button>
    </form>
  );
}


export default MyJobs;