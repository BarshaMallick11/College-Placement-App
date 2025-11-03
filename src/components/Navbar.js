import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../index';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = observer(() => {
  const store = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    store.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h3>College Placement</h3>
      {store.isAuthenticated && (
        <div className="nav-links">
          <span>Welcome, {store.user.email} ({store.user.role})</span>
          {store.userRole === 'admin' ? (
            <Link to="/admin">Admin Home</Link>
          ) : (
            <Link to="/student">Student Home</Link>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
});

export default Navbar;