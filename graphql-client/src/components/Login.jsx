import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import '../index.css';

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      message
      user {
        id
        username
        email
        role
      }
    }
  }
`;

function Login({ onAuthChange }) {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser({
        variables: {
          email: loginData.email,
          password: loginData.password,
        },
      });

   if (result.data.login.user) {

  if (onAuthChange) {
    await onAuthChange();
  }

  navigate('/');
}
    } catch (err) {
      console.log('Login error:', err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-header">
          <h1 className="login-brand-box">GAMING TOURNAMENTS</h1>
          <div className="login-brand-title">myLogin</div>
        </div>

        <h2 className="login-title-bar">Sign in to your account</h2>

        <div className="login-body">
          <div className="login-form-section">
            {error && (
              <Alert variant="danger" className="mb-3" role="alert">
                Authentication Failed! Please Retry
              </Alert>
            )}

            {data && (
              <Alert variant="success" className="mb-3" role="alert">
                {data.login.message}
              </Alert>
            )}

            <Form
              onSubmit={handleSubmit}
              aria-label="Login form"
              aria-describedby="login-help-text"
            >
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  aria-label="Password"
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                className="login-btn"
                disabled={loading}
                aria-label="Sign in to your account"
                aria-busy={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form>

            {data && data.login.user && (
              <div className="login-user-box">
                <p><strong>User:</strong> {data.login.user.username}</p>
                <p><strong>Role:</strong> {data.login.user.role}</p>
              </div>
            )}
          </div>

          <div className="login-image-section">
            <img
              src="/images/loginimage.jpeg"
              alt="Gaming tournament login visual"
            />
          </div>
        </div>

        <div id="login-help-text" className="login-footer-text">
          Login using your registered email and password.
          <br />
          This page is for players and admin users of the Gaming Tournament System.
        </div>
      </div>
    </div>
  );
}

export default Login;