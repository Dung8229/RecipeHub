import React, { useState } from 'react';
import { isPasswordStrong } from '../../../Backend/utils/password-utils';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', username: '', confirmPassword: '' });
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

    fetch('http://localhost:3000/api/users/login', {
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

        window.location.href = 'http://localhost:5173';
      })
      .catch((error) => {
      });
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
            setError(err.error || 'Failed to log in');
            throw new Error(err.error || 'Failed to log in');
          });
        }
        return response.json();
      })
      .then((data) => {
        window.location.href = 'http://localhost:5173/login';
      })
      .catch((error) => {
      });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('')
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <img
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
        src="https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg"
        alt="Background"
      />
      <div style={{
        width: '90%',
        maxWidth: '500px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        <div style={{
          color: '#ff8c00',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          Recipehub
        </div>
        <div style={{
          color: 'black',
          fontSize: '2rem',
          fontWeight: 'bold',
        }}>
          {isLogin ? 'Log in with email' : 'Sign up with email'}
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={isLogin ? handleLogin : handleSignup} style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: '15px',
        }}>
          {isLogin ? (
            <>
              <InputField
                label="E-mail"
                id="signin-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="E-mail"
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <label htmlFor="signin-password" style={{ marginRight: '8px', width: '100%' }}>Password</label>
                  <input
                    type="checkbox"
                    id="show-password"
                    checked={showPassword}
                    onChange={toggleShowPassword}
                    style={{ marginLeft: '8px' }}
                  />
                  <label htmlFor="show-password" style={{ marginLeft: '4px' }}>Show</label>
                </div>
                <InputField
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  style={{ marginTop: '8px', width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" id="remember-me" />
                <label htmlFor="remember-me" style={{ marginLeft: '8px' }}>Remember me</label>
              </div>
            </>
          ) : (
            <>
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <label htmlFor="signup-password" style={{ marginRight: '8px', width: '100%' }}>Password</label>
                  <input
                    type="checkbox"
                    id="show-password"
                    checked={showPassword}
                    onChange={toggleShowPassword}
                    style={{ marginLeft: '8px' }}
                  />
                  <label htmlFor="show-password" style={{ marginLeft: '4px' }}>Show</label>
                </div>
                <InputField
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  style={{ marginTop: '8px', width: '100%' }}
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" id="accept-terms" required />
                <label htmlFor="accept-terms" style={{ marginLeft: '8px' }}>
                  I agree to the <a href="#0">Terms</a>
                </label>
              </div>
            </>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              height: '63px',
              backgroundColor: '#ff8c00',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            {isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}>
            <button
              type="button"
              onClick={toggleForm}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff8c00',
                fontSize: '1.2rem',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {isLogin ? 'Don’t have an account? Join now' : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
        <SocialLoginOptions />
      </div>
    </div>
  );
};

const InputField = ({ label, id, type, name, value, onChange, placeholder }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
    <label htmlFor={id}>{label}</label>
    <input
      style={{
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
      }}
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
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  }}>
    <a href="http://localhost:3000/auth/facebook" style={{
      width: '48%',
      height: '63px',
      backgroundColor: '#1877f2',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      transition: 'background-color 0.3s',
    }}>
      <i className="fa fa-facebook" style={{
        marginRight: '8px',
        fontSize: '1.3rem',
        border: '3px solid white',
        borderRadius: '50%',
        padding: '8px',
      }}></i> 
      FACEBOOK
    </a>
    <a href="http://localhost:3000/auth/google" style={{
      width: '48%',
      height: '63px',
      backgroundColor: '#db4437',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      transition: 'background-color 0.3s',
    }}>
      <i className="fa fa-google" style={{
        marginRight: '8px',
        fontSize: '1.3rem',
        border: '3px solid white',
        borderRadius: '50%',
        padding: '8px',
      }}></i> 
      GOOGLE
    </a>
  </div>
);

export default LoginRegister;