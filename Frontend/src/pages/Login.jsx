import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const { email, password } = formData;

    fetch('http://localhost:3002/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => {
            setError(err.error || 'Failed to log in');
            throw new Error(err.error || 'Failed to log in');
          });
        }
        return response.json();
      })
      .then((data) => {
        // Lưu token vào localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.userlogin));
        window.location.href = 'http://localhost:5173';
      })
      .catch((error) => {
        console.error('Login error:', error);
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
          Log in with email
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
          <InputField
            label="E-mail"
            id="signin-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="E-mail"
          />

          <div className="flex flex-col items-start">
            <div className="flex items-center w-full">
              <label htmlFor="signin-password" className="mr-2 w-full">Password</label>
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
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="mt-2 w-full"
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="remember-me" className="mr-2" />
            <label htmlFor="remember-me">Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full h-[63px] bg-orange-500 text-white text-xl font-bold rounded-lg cursor-pointer hover:bg-orange-600 transition-colors"
          >
            LOG IN
          </button>

          <div className="flex justify-center mt-3">
            <Link
              to="/register"
              className="text-orange-500 text-lg underline hover:text-orange-600"
            >
              Don't have an account? Join now
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
      <i className="fa-brands fa-facebook-f mr-2 text-2xl border-3 border-white rounded-full p-2"></i>
      FACEBOOK
    </a>
    <a href="http://localhost:3000/auth/google"
      className="w-[48%] h-[63px] bg-[#db4437] rounded-lg flex items-center justify-center text-white text-xl font-bold hover:bg-[#c53929] transition-colors">
      <i className="fa-brands fa-google mr-2 text-2xl border-3 border-white rounded-full p-2"></i>
      GOOGLE
    </a>
  </div>
);

export default Login;
