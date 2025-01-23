import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    if (!email || !password) {
      toast.error('Please fill in all fields!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/api/v1/login', { email, password });
      toast.success(response.data.message || 'Signed in successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred!');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (e.target as HTMLFormElement).name.value;
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    if (!name || !email || !password) {
      toast.error('Please fill in all fields!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/api/v1/registeration', {
        name,
        email,
        password,
      });

      toast.success(response.data.message || 'Registration successful!');
      if (response.data.activationToken) {
        setTimeout(() => {
          navigate('/otp', { state: { activationToken: response.data.activationToken } });
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred!');
    }
  };

  return (
    <div className="page-wrapper">
      <div className = "newContainer">
      <div className={`container ${isSignUp ? 'active' : ''}`}>
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <span>or use your account</span>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us, please log in with your personal info</p>
              <button className="toggle-button" onClick={toggleMode}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="toggle-button" onClick={toggleMode}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;