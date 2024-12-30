import axios from "axios";
import React, { useState } from "react";
import '../css/employer-css/postjob.css'
import validateInput from "../shared/regex";

function PostJob() {
  const token = localStorage.getItem('token');
  const [input, setInput] = useState({
    title: "",
    description: "",
    datePosted: "",
    city: "",
    country: "",
    salary: "",
    company: "",
    jobType: "Full Time"
  });

  const [errors,setErrors]=useState({title:'', description:'', salary:''})

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handlePost = async (e) => {
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

      const response = await axios.post('http://localhost:5000/employer/post-job', input, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert(response.data.message);
    } catch (err) {
      alert(err.message);
      console.log(err);
    }
  };

  return (
    <form onSubmit={handlePost}> 
      <h4>Post a Job</h4>

      <div className="post-container">
        <div className="gap">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={input.title}
            onChange={handleChange}
            required
          />
        </div>
        {errors.title && (<p className="error">{errors.title}</p>)}

        <div className="gap">
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            id="city"
            value={input.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="gap">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            name="country"
            id="country"
            value={input.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className="gap">
          <label htmlFor="salary">Salary</label>
          <input
            type="text"
            name="salary"
            id="salary"
            value={input.salary}
            onChange={handleChange}
            required
          />
        </div>
        {errors.salary && (<p className="error">{errors.salary}</p>)}

        <div className="gap">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            name="company"
            id="company"
            value={input.company}
            onChange={handleChange}
            required
          />
        </div>

        <div className="gap">
          <label htmlFor="jobType">Job Type</label>
        
          <div className="job-types">   
              <div className="job-pos">
              <input type="radio"  name="jobType"  id="parttime" onChange={handleChange} value="Part Time" checked={input.jobType==="Part Time"}/>
              <label htmlFor="parttime">Part Time</label>
              </div>

              <div className="job-pos">
              <input type="radio"  name="jobType"  id="fulltime" onChange={handleChange} value="Full Time" checked={input.jobType==="Full Time"}/>
              <label htmlFor="fulltime">Full Time</label>
              </div>
          </div>
        </div>

        <div className="gap">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={input.description}
            onChange={handleChange}
            rows={15}
            cols={20}
            required
          ></textarea>
        </div>
        {errors.description && (<p className="error">{errors.description}</p>)}

          
          <div className="set"><button type="submit">Post</button></div>
        
      </div>
    </form>
  );
}

export default PostJob;
