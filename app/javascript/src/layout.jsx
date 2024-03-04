import React, { useState, useEffect } from 'react';
import { safeCredentials } from './utils/fetchHelper';

const Layout = (props) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Fetch authenticated status on component mount
    fetch('/api/authenticated')
      .then(response => response.json())
      .then(data => {
        setAuthenticated(data.authenticated);
      })
      .catch(error => {
        console.error('Error fetching authenticated status:', error);
      });
  }, []);

  const logout = () => {
    fetch(`/api/sessions/destroy`, safeCredentials( {
      method: 'DELETE',
      credentials: 'include', // Include cookies for session management
    }))
    .then(response => {
      if (response.ok) {
        // Optionally, perform any additional actions upon successful logout
        // For example, redirect to the login page
        window.location.href = '/login'; // Redirect to login page
      } else {
        // Handle error
        console.error('Error logging out:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error logging out:', error);
    });
  };

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand text-danger" href="/">Airbnb</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/properties">Properties</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/bookings">Bookings</a>
              </li>
              {authenticated && (
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {props.children}
      <footer className="p-3 bg-light">
        <div>
          <p className="me-3 mb-0 text-secondary">Airbnb Clone</p>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default Layout;
