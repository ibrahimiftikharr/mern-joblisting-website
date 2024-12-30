import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './components/shared/regex'
import EmployerDashboard from './components/employer/EmployerDashboard';
import JobseekerDashboard from './components/client/JobseekerDashboard';
import validateInput from './components/shared/regex';

function Signup() 
{
    const [input, setInput] = useState({
        email: '',
        password: '',
        role: ''
    });

    const [token, setToken] = useState('');
    const [role, setRole] = useState('');

    const[errors, setErrors]=useState({email:'',password:''})

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedRole = localStorage.getItem('role');

        if (savedToken && savedRole) {
            setToken(savedToken);
            setRole(savedRole);
        }
    }, []);

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
     try {
            if (!input.email || !input.password || !input.role) {
                alert("One or more fields are missing!");
                return;
            }

            const emailError=validateInput('email',input.email)
            const passwordError=validateInput('password',input.password)

            if(emailError || passwordError)
            {
                setErrors({email:emailError, password:passwordError});
                return;
            }

            const response = await axios.post('http://localhost:5000/auth/signup', input);
            alert(response.data.message);
        } catch (err) {
            alert('Error: ' + err.message);
            console.log("Error:", err);
        }
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            if (!input.role || !input.email || !input.password) {
                alert("One or more fields are missing!");
                return;
            }

            const response = await axios.post('http://localhost:5000/auth/signin', input);

            const myToken = response.data.token;
            setToken(myToken);
            setRole(input.role);

            localStorage.setItem('token', myToken);
            localStorage.setItem('role', input.role);

            alert("Logged in successfully!");
        } catch (err) {
            alert('Error: ' + err.response?.data?.error || err.message);
            console.log("Error:", err);
        }
    };

    // Redirect to the appropriate dashboard if logged in
    if (token) {
        if (role === "employer") {
            return <EmployerDashboard token={token} />;
        } else if (role === "jobseeker") {
            return <JobseekerDashboard />;
        }
    }

    return (
        <form>
            <div className="info">
                <h4>Ready to take the next step?</h4>
                <p>Create an account or sign in.</p>
            </div>

            <div className="container">
                <div className="email">
                    <label htmlFor="email" className="poppins-medium">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={input.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                    />
                </div>

                {
                    errors.email && (<p className='error'>{errors.email}</p>)
                }

                <div className="password">
                    <label htmlFor="password" className="poppins-medium">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={input.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                    />
                </div>

                {
                    errors.password && (<p className='error'>{errors.password}</p>)
                }

                <label className="poppins-medium">Role</label>
                <div className="role">
                    <input
                        type="radio"
                        id="employer"
                        name="role"
                        value="employer"
                        onChange={handleChange}
                        checked={input.role === "employer"}
                    />
                    <label htmlFor="employer" className="poppins-regular">Employer</label>
                </div>

                <div>
                    <input
                        type="radio"
                        id="jobseeker"
                        name="role"
                        value="jobseeker"
                        onChange={handleChange}
                        checked={input.role === "jobseeker"}
                    />
                    <label htmlFor="jobseeker" className="poppins-regular">Jobseeker</label>
                </div>

                <div className="button">
                    <button type="button" className="btn-color" onClick={(e) => handleSignup(e)}>Signup</button>
                    <button type="button"  id="signin" onClick={(e) => handleSignin(e)}>Signin</button>
                </div>
            </div>
        </form>
    );
}

export default Signup;
