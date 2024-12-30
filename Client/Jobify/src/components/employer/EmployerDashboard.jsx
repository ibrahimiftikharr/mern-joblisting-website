import React, { useState } from 'react';
import '../css/employer-css/employerdashboard.css';
import PostJob from './postJob';
import MyJobs from './MyJobs';
import Applications from './Applications';

function EmployerDashboard({ token }) {
  const [activeComponent, setActiveComponent] = useState(null);

  const logout=()=>{
      localStorage.removeItem('token')
      alert('Logout Successful!')
      window.location.reload(); 
  }

  const components = {
    PostJob: <PostJob />,    
    MyJobs: <MyJobs />,
    Applications: <Applications/>,
  };

  return (
    <div className="grid-container">
      <div className="sidebar">
        <button onClick={() => setActiveComponent('PostJob')} className="sidebar-button">
          <span className="material-symbols-outlined font-control">work</span>
          <span>Post Job</span>
        </button>

        <button onClick={() => setActiveComponent('MyJobs')} className="sidebar-button">
          <span className="material-symbols-outlined font-control">apps</span>
          <span>My Jobs</span>
        </button>

        <button onClick={() => setActiveComponent('Applications')} className="sidebar-button">
          <span className="material-symbols-outlined font-control">sync_saved_locally</span>
          <span>Applications</span>
        </button>

        <button className='sidebar-button' onClick={logout}>
        <span className="material-symbols-outlined font-control">logout</span>
          <span>Logout</span>
        </button>
      </div>

      <div className="right-column"></div>

      <div className="component-container">
        {activeComponent ? components[activeComponent] : <PostJob />}
      </div>
    </div>
  );
}

export default EmployerDashboard;
