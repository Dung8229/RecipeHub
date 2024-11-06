import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isPasswordStrong } from '../../../Backend/utils/password-utils';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSignup = (event) => {
    event.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!isPasswordStrong(password)) {
      setError('Password must be at least 8 characters long, include uppercase, lowercase, numbers, and special characters.')
      return;
    }

    fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => {
            setError(err.error || 'Failed to register');
            throw new Error(err.error || 'Failed to register');
          });
        }
        return response.json();
      })
      .then((data) => {
        window.location.href = 'http://localhost:5173/login';
      })
      .catch((error) => {
        console.error('Registration error:', error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen relative overflow-hidden">
      <img
        className="absolute w-full h-full object-cover z-[-1]"
        src="https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg"
        alt="Background"
      />
      
      <div className="w-[90%] max-w-[500px] bg-white/90 rounded-lg p-5 shadow-lg flex flex-col items-center gap-5">
        <div className="text-orange-500 text-4xl font-bold text-center">
          Recipehub
        </div>
        
        <div className="text-black text-3xl font-bold">
          Sign up with email
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <form onSubmit={handleSignup} className="flex flex-col w-full gap-4">
          <InputField
            label="Username"
            id="signup-username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
          />

          <InputField
            label="E-mail"
            id="signup-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="E-mail"
          />

          <div className="flex flex-col items-start">
            <div className="flex items-center w-full">
              <label htmlFor="signup-password" className="mr-2 w-full">Password</label>
              <input
                type="checkbox"
                id="show-password"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="ml-2"
              />
              <label htmlFor="show-password" className="ml-1">Show</label>
            </div>
            <InputField
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="mt-2 w-full"
            />
          </div>

          <InputField
            label="Confirm Password"
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
          />

          <div className="flex items-center">
            <input type="checkbox" id="accept-terms" required className="mr-2" />
            <label htmlFor="accept-terms">
              I agree to the <a href="#0" className="text-orange-500 hover:text-orange-600">Terms</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full h-[63px] bg-orange-500 text-white text-xl font-bold rounded-lg cursor-pointer hover:bg-orange-600 transition-colors"
          >
            CREATE ACCOUNT
          </button>

          <div className="flex justify-center mt-3">
            <Link
              to="/login"
              className="text-orange-500 text-lg underline hover:text-orange-600"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>

        <SocialLoginOptions />
      </div>
    </div>
  );
};

const InputField = ({ label, id, type, name, value, onChange, placeholder, className = '' }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className}`}>
    <label htmlFor={id}>{label}</label>
    <input
      className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
  </div>
);

const SocialLoginOptions = () => (
  <div className="flex justify-between w-full">
    <a href="http://localhost:3000/auth/facebook" 
      className="w-[48%] h-[63px] bg-[#1877f2] rounded-lg flex items-center justify-center text-white text-xl font-bold hover:bg-[#1665d8] transition-colors">
      <i className="fa fa-facebook mr-2 text-2xl border-3 border-white rounded-full p-2"></i>
      FACEBOOK
    </a>
    <a href="http://localhost:3000/auth/google"
      className="w-[48%] h-[63px] bg-[#db4437] rounded-lg flex items-center justify-center text-white text-xl font-bold hover:bg-[#c53929] transition-colors">
      <i className="fa fa-google mr-2 text-2xl border-3 border-white rounded-full p-2"></i>
      GOOGLE
    </a>
  </div>
);

export default Register;
