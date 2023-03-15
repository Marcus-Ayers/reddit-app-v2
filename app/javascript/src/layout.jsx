import React, { useState, useEffect } from 'react';
import './layout.scss';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';


const Layout = (props) => {
  const [state, setState] = useState({
    isOpen: false,
    authenticated: false,
    username: [],
    show_login: true,
  });

  useEffect(() => {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(data => {
        console.log(data);
        setState({
          ...state,
          username: data.username,
          authenticated: data.authenticated,
        });
      })
      .catch(error => {
        console.error("Not Logged in " + error);
      });
  }, []);

  const toggleDropdown = () => {
    setState((prevState) => ({ ...prevState, isOpen: !prevState.isOpen }));
    if (!state.isOpen) {
      setTimeout(() => {
        document.getElementById('title');
      }, 0);
    }
  };

  const toggle = () => {
    setState({
      ...state,
      show_login: !state.show_login,
    });
  };

  const handleLogout = () => {
    // Send a DELETE request to the '/sessions' endpoint to log the user out
    fetch('/sessions', {
      method: 'DELETE',
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.ok) {
        // Reload the page if the response is OK (successful logout)
        window.location.reload();
      } else {
        // Throw an error if the response is not OK (failed logout)
        throw new Error('Failed to logout');
      }
    })
    .catch(error => {
      console.error(error);
    });
  };

  const handleSignOut = () => {
    // Send a DELETE request to the '/api/sessions' endpoint with CSRF token to log the user out
    fetch('/api/sessions', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      }
    })
    .then(response => {
      if (response.ok) {
        // Redirect the user to the home page if the response is OK (successful logout)
        window.location.href = '/';
      }
    });
  }

  const { authenticated, username, isOpen } = state;

  const logoutButton = (
    <div className="container">

    <form action="/api/sessions" method="post">
      <div className="navbar-layout">
      <h4 className='navbar-username' onClick={toggleDropdown}>{username}</h4>
      {isOpen && (
        <div className="dropdown-username">
      <button type="button" className="btn btn-outline-danger ml-1" onClick={handleSignOut}>
        Sign out
      </button>
        </div>
      )}
      </div>
    </form>
    </div>
    
  );

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand navbar-light home-background">
          
          <div className="container-fluid">
            {/* Reddit logo */}
            <img src="https://logodownload.org/wp-content/uploads/2018/02/reddit-logo-16.png" alt="Reddit logo" className="logo"></img>
  
            {/* Navigation bar links */}
            <a className="navbar-brand text-danger" href="/">Reddit</a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  {authenticated ? (
                    // Render the logout button if the user is authenticated
                    logoutButton
                    ) : (
                      // Render the login and signup buttons if the user is not authenticated
                      <a href={`/login`}>
                      <button type="button" className="btn btn-outline-primary mr-4 login-btn">Log In</button>
                      <button type="button" className="btn btn-primary signup-btn">Sign up</button>
                    </a>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
                        <div className="footer">
        {/* Render the child components */}
        {props.children}
        {/* Footer */}
        <footer className="p-3 home-background ">
          <div>
            <p className="me-3 mb-0 text-secondary">Reddit Clone</p>
          </div>
        </footer>
                  </div>
    </React.Fragment>
  );
};

export default Layout;
