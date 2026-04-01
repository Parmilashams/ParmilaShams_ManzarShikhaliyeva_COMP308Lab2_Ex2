import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../index.css';

const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!, $role: String) {
    register(username: $username, email: $email, password: $password, role: $role) {
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

function Register({ onAuthChange }) {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Player',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });

    setFormError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{6,}$/;

    if (!passwordRegex.test(userData.password)) {
      setFormError(
        'Password must be at least 6 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      const result = await registerUser({
        variables: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role,
        },
      });

      if (result.data.register.user) {
        setFormError('');
        setSuccessMessage('Registration successful! Redirecting...');

        if (onAuthChange) {
          await onAuthChange();
        }

        setTimeout(() => {
          setUserData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'Player',
          });

          if (result.data.register.user.role === 'Admin') {
            navigate('/addtournament');
          } else {
            navigate('/tournaments');
          }
        }, 1200);
      }
    } catch (err) {
      console.log('Registration error:', err.message);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="register-header">
          <h2>Register</h2>
        </div>

        {formError && (
          <Alert variant="danger" role="alert">
            {formError}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" role="alert">
            This email is already registered. Please log in or use another email
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" role="alert">
            {successMessage}
          </Alert>
        )}

        <div className="register-body">
          <div className="register-form">
            <Form onSubmit={handleSubmit} aria-label="Registration form">
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  placeholder="Enter user name"
                  aria-label="User name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  aria-label="Email address"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3 password-field" controlId="formPassword">
  <Form.Label>Password</Form.Label>

  <div className="password-wrapper">
    <Form.Control
      type={showPassword ? "text" : "password"}
      name="password"
      value={userData.password}
      onChange={handleChange}
      placeholder="Enter password"
      required
    />

    <span
      className="password-toggle"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</Form.Group>

<Form.Group className="mb-3 password-field" controlId="formConfirmPassword">
  <Form.Label>Confirm Password</Form.Label>

  <div className="password-wrapper">
    <Form.Control
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      value={userData.confirmPassword}
      onChange={handleChange}
      placeholder="Confirm password"
      required
    />

    <span
      className="password-toggle"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</Form.Group>

              <Form.Group className="mb-4" controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  aria-label="Select user role"
                >
                  <option value="Player">Player</option>
                  <option value="Admin">Admin</option>
                </Form.Select>
              </Form.Group>

              <Button
                className="register-btn"
                type="submit"
                disabled={loading}
                aria-label="Register"
                aria-busy={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Form>
          </div>

          <div className="register-image">
            <img
              src="/images/gaming.avif"
              alt="Gaming tournament setup"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;