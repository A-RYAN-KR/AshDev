import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './OtpVerification.css';

const OtpVerificationPage: React.FC = () => {
  const [activationCode, setActivationCode] = useState(['', '', '', '']);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const activationToken = location.state?.activationToken;

  if (!activationToken) {
    toast.error('Invalid access to OTP page.');
    navigate('/');
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = activationCode.join('');

    if (code.length !== 4) {
      toast.error('Please enter the 4-digit activation code!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/api/v1/activate-user', {
        activation_token: activationToken,
        activation_code: code,
      });

      toast.success(response.data.message || 'Account activated successfully!');
      setTimeout(() => navigate('/login'), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Activation failed!');
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...activationCode];
    newCode[index] = value;
    setActivationCode(newCode);

    if (value) {
      if (index < 3) {
        codeRefs.current[index + 1]?.focus();
      }
    } else if (index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="otp-page">
      <form className="otp-form" onSubmit={handleOtpSubmit}>
        <h1>Enter OTP</h1>
        <p className='mt-4'>Check your email for the activation code</p>
        <div className="otp-input mt-4">
          {activationCode.map((_, index) => (
            <input
              key={index}
              type="text"
              pattern="\d*"
              maxLength={1}
              value={activationCode[index]}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !activationCode[index] && index > 0) {
                  codeRefs.current[index - 1]?.focus();
                }
              }}
              ref={(input) => (codeRefs.current[index] = input)}
              required
            />
          ))}
        </div>
        <button type="submit" className='button-40'>Submit OTP</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default OtpVerificationPage;