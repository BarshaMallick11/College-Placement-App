import React, { useState } from 'react'; // Make sure useState is imported
import { useStore } from '../index';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Validation schema using Yup (no change)
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const Login = observer(() => {
  const store = useStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  // --- NEW: State to track login mode ---
  const [loginMode, setLoginMode] = useState('student'); // 'student' or 'admin'

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { resetForm }) => {
      setError(''); // Clear previous errors
      
      // --- UPDATED: Call the new loginUser action with the loginMode ---
      const success = store.loginUser(values.email, values.password, loginMode);

      if (success) {
        // Redirect based on role (this logic is still valid)
        const path = store.userRole === 'admin' ? '/admin' : '/student';
        navigate(path);
      } else {
        // --- UPDATED: More specific error message ---
        setError(`Invalid ${loginMode} email or password`);
      }
    },
  });
  
  // --- NEW: Helper function to switch mode ---
  const handleModeSwitch = (mode) => {
    setLoginMode(mode);
    setError('');       // Clear any errors
    formik.resetForm(); // Reset the form fields
  };

  return (
    <div className="form-container">
      
      {/* --- NEW: Login Switcher UI --- */}
      <div className="login-switcher">
        <button
          type="button" // Prevent form submission
          className={loginMode === 'student' ? 'active' : ''}
          onClick={() => handleModeSwitch('student')}
        >
          Student Login
        </button>
        <button
          type="button"
          className={loginMode === 'admin' ? 'active' : ''}
          onClick={() => handleModeSwitch('admin')}
        >
          Admin Login
        </button>
      </div>
      {/* --- End of New UI --- */}

      {/* --- UPDATED: Dynamic Header --- */}
      <h2>{loginMode === 'student' ? 'Student Login' : 'Admin Login'}</h2>
      
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            placeholder={
              loginMode === 'student'
                ? 'student@example.com'
                : 'admin@example.com'
            }
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            placeholder="123"
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error">{formik.errors.password}</div>
          ) : null}
        </div>

        {error && <div className="error">{error}</div>}

        {/* --- UPDATED: Dynamic Button Text --- */}
        <button type="submit" className="login-submit-btn">
          Login as {loginMode === 'student' ? 'Student' : 'Admin'}
        </button>
      </form>
    </div>
  );
});

export default Login;