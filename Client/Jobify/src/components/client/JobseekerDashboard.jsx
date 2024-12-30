import React, { useState, useEffect } from "react";
import indeedLogo from "../assets/logo.png";
import "../css/jobseeker-css/jobseekerdashboard.css";
import Home from './Home'
import MyCV from "./MyCV";
import MyApplications from "./MyApplications";

function JobseekerDashboard() {
  const [activeComponent, setActiveComponent] = useState(null);
  
  const components = {
    Home: <Home />,    
    MyApplications: <MyApplications/>,
    MyCV: <MyCV />,
  };

  const logout=()=>{
    localStorage.removeItem('token')
    alert('Logout Successful!')
    window.location.reload(); 
}

  return (
    <div className="main-container">
      <header>
        <img src={indeedLogo} alt="Indeed" />
        <nav>
          <ul>
            <li><button onClick={()=>setActiveComponent('Home')}>Home</button></li>
            <li><button onClick={()=>setActiveComponent('MyApplications')}>My Applications</button></li>
            <li><button onClick={()=>setActiveComponent('MyCV')}>My CV</button></li>
            <li><button onClick={logout} >Log Out</button></li>
          </ul>
        </nav>
      </header>

      <main>
          {
              activeComponent? components[activeComponent]: <Home />
          }
      </main>

      <footer>
        <p>&copy; 2024 Indeed. All rights reserved.</p>
      </footer>

    </div>
  );
}


export default JobseekerDashboard;
