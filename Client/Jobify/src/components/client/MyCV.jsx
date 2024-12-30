import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/jobseeker-css/mycv.css";

function MyCV() {
  const token = localStorage.getItem("token");
  const [cv, setCv] = useState(null);
  const [input, setInput] = useState({ name: "", description: "" });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fetchCV = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/jobseeker/fetch-cv",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setCv(response.data);
        setInput({
          name: response.data.name || "",
          description: response.data.description || "",
        });
      } else {
        setCv(null);
        setInput({ name: "", description: "" });
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchCV();
  }, [token]);

  const createOrUpdateCV = async (e) => {
    e.preventDefault();
    try {
      const url = cv
        ? "http://localhost:5000/jobseeker/update-cv"
        : "http://localhost:5000/jobseeker/create-cv";
      const method = cv ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: input,
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
      fetchCV();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
      console.error(err);
    }
  };

  const deleteCV = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/jobseeker/delete-cv",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        alert(response.data.message);
        setCv(null);
        setInput({ name: "", description: "" });
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message);
      console.error(err);
    }
  };

  return (
    <div className="cv-main-container">
      <div>
        <h3>Curriculum Vitae</h3>
        {cv ? (
          <div className="cv">
            <div className="cv-item">
              <strong>Name: </strong>
              <div>{cv?.name || "No name provided"}</div>
            </div>
            <div className="cv-item">
              <strong>Description: </strong>
              <div>{cv?.description || "No description provided"}</div>
            </div>
            <button onClick={deleteCV} className="submit-cv-button">
              Delete CV
            </button>
          </div>
        ) : (
          <div>No CV found. Please create one.</div>
        )}
      </div>

      <div>
        <h3>{cv ? "Update your CV" : "Create your CV"}</h3>
        <form onSubmit={createOrUpdateCV}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={input.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            cols="50"
            value={input.description}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="submit-cv-button">
            {cv ? "Update CV" : "Create CV"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MyCV;
