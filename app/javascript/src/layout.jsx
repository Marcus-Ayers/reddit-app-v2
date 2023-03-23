import React, { useState, useEffect } from 'react';
import './layout.scss';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';


const Layout = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState([]);
  const [id, setId] = useState('')
  const [show_login, setShowLogin] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const subredditSuggestions = [
    { id: 1, name: 'r/Funny' },
    { id: 2, name: 'r/Pics' },
    { id: 3, name: 'r/Gaming' },
  ];


  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);

    if (event.target.value.toLowerCase() == 'all') {
      fetch(`/api/subreddits`)
    .then(handleErrors)
    .then((data) => {
      setSearchResults(data.subreddits);
    })
    .catch((error) => {
      console.error('Error fetching search results:', error);
    });

    } else if (event.target.value.length > 1) {
      // Make an API call to fetch the search results and update the state
      fetch(`/api/search/subreddits?query=${event.target.value}`)
        .then(handleErrors)
        .then((data) => {
          setSearchResults(data.subreddits);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
        });
    } else {
      setSearchResults([]);
    }
    if (event.target.value.length > 0) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  };

  const searchBox = (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search Reddit"
        value={searchInput}
        onChange={handleSearchInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && (
        <div className="search-results-dropdown">
          <p className='suggested'>Suggested subreddits</p>
          {subredditSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="search-result-item" onClick={() => window.location.href = `/subreddit/${suggestion.id}`}>
              <a href={`/subreddit/${suggestion.id}`}>{suggestion.name}</a>
            </div>
          ))}
          <p className='hint'> Hint: Type 'all' to see all subreddits</p>
        </div>
      )}
      {searchResults.length > 0 && !showSuggestions && (
        <div className="search-results-dropdown">
          {searchResults.map((result) => (
              <div key={result.id} className="search-result-item" onClick={() => window.location.href = `/subreddit/${result.id}`}>
              <a href={`/subreddit/${result.id}`}>{result.name}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(data => {
        setId(data.id)
        setUsername(data.username);
        setAuthenticated(data.authenticated);
      })
      .catch(error => {
        console.error("Not Logged in " + error);
      });
  }, []);

  const toggleDropdown = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
    if (!isOpen) {
      setTimeout(() => {
        document.getElementById('title');
      }, 0);
    }
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

  const logoutButton = (
    <div className="container">

    <form action="/api/sessions" method="post">
      <div className="navbar-layout">
      <h4 className='navbar-username mr-3' onClick={toggleDropdown}>{username}</h4>
      {isOpen && (
        <div className="dropdown-username d-flex">
      <button type="button" className="btn btn-outline-danger ml-1" onClick={handleSignOut}>
        Sign out
      </button>
      <a href={`/user/${id}`}>
        <button className='btn ml-1 mt-2' type='button' >Profile</button>
      </a>
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
            {/* Reddit logo and title */}
            <a href='/'>
            <img src="https://logodownload.org/wp-content/uploads/2018/02/reddit-logo-16.png" alt="Reddit logo" className="logo"></img>
            <svg className="reddit-name _1bWuGs_1sq4Pqy099x_yy-" href='/' viewBox="0 0 57 18" xmlns="http://www.w3.org/2000/svg"><g fill="#D7DADC"><path d="M54.63,16.52V7.68h1a1,1,0,0,0,1.09-1V6.65a1,1,0,0,0-.93-1.12H54.63V3.88a1.23,1.23,0,0,0-1.12-1.23,1.2,1.2,0,0,0-1.27,1.11V5.55h-1a1,1,0,0,0-1.09,1v.07a1,1,0,0,0,.93,1.12h1.13v8.81a1.19,1.19,0,0,0,1.19,1.19h0a1.19,1.19,0,0,0,1.25-1.12A.17.17,0,0,0,54.63,16.52Z"></path><circle fill="#FF4500" cx="47.26" cy="3.44" r="2.12"></circle><path d="M48.44,7.81a1.19,1.19,0,1,0-2.38,0h0v8.71a1.19,1.19,0,0,0,2.38,0Z"></path><path d="M30.84,1.19A1.19,1.19,0,0,0,29.65,0h0a1.19,1.19,0,0,0-1.19,1.19V6.51a4.11,4.11,0,0,0-3-1.21c-3.1,0-5.69,2.85-5.69,6.35S22.28,18,25.42,18a4.26,4.26,0,0,0,3.1-1.23,1.17,1.17,0,0,0,1.47.8,1.2,1.2,0,0,0,.85-1.05ZM25.41,15.64c-1.83,0-3.32-1.77-3.32-4s1.48-4,3.32-4,3.31,1.78,3.31,4-1.47,3.95-3.3,3.95Z"></path><path d="M43.28,1.19A1.19,1.19,0,0,0,42.09,0h0a1.18,1.18,0,0,0-1.18,1.19h0V6.51a4.15,4.15,0,0,0-3-1.21c-3.1,0-5.69,2.85-5.69,6.35S34.72,18,37.86,18A4.26,4.26,0,0,0,41,16.77a1.17,1.17,0,0,0,1.47.8,1.19,1.19,0,0,0,.85-1.05ZM37.85,15.64c-1.83,0-3.31-1.77-3.31-4s1.47-4,3.31-4,3.31,1.78,3.31,4-1.47,3.95-3.3,3.95Z"></path><path d="M17.27,12.44a1.49,1.49,0,0,0,1.59-1.38v-.15a4.81,4.81,0,0,0-.1-.85A5.83,5.83,0,0,0,13.25,5.3c-3.1,0-5.69,2.85-5.69,6.35S10.11,18,13.25,18a5.66,5.66,0,0,0,4.39-1.84,1.23,1.23,0,0,0-.08-1.74l-.11-.09a1.29,1.29,0,0,0-1.58.17,3.91,3.91,0,0,1-2.62,1.12A3.54,3.54,0,0,1,10,12.44h7.27Zm-4-4.76a3.41,3.41,0,0,1,3.09,2.64H10.14A3.41,3.41,0,0,1,13.24,7.68Z"></path><path d="M7.68,6.53a1.19,1.19,0,0,0-1-1.18A4.56,4.56,0,0,0,2.39,6.91V6.75A1.2,1.2,0,0,0,0,6.75v9.77a1.23,1.23,0,0,0,1.12,1.24,1.19,1.19,0,0,0,1.26-1.1.66.66,0,0,0,0-.14v-5A3.62,3.62,0,0,1,5.81,7.7a4.87,4.87,0,0,1,.54,0h.24A1.18,1.18,0,0,0,7.68,6.53Z"></path></g></svg>
            </a>
            {/* SEARCH BOX */}
            <div className="search-container search-mobile">
              <input
                type="text"
                className="search-input"
                placeholder="Search Reddit"
                value={searchInput}
                onChange={handleSearchInputChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {showSuggestions && (
                <div className="search-results-dropdown">
                  <p className='suggested'>Suggested subreddits</p>
                  {subredditSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="search-result-item" onClick={() => window.location.href = `/subreddit/${suggestion.id}`}>
                      <a href={`/subreddit/${suggestion.id}`}>{suggestion.name}</a>
                    </div>
                  ))}
                  <p className='hint'> Hint: Type 'all' to see all subreddits</p>
                </div>
              )}
              {searchResults.length > 0 && !showSuggestions && (
                <div className="search-results-dropdown">
                  {searchResults.map((result) => (
                      <div key={result.id} className="search-result-item" onClick={() => window.location.href = `/subreddit/${result.id}`}>
                      <a href={`/subreddit/${result.id}`}>{result.name}</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
                    {/* USERNAME OR LOGIN */}
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  {authenticated ? (
                    // Render the logout button if the user is authenticated
                    logoutButton
                    ) : (
                      // Render the login and signup buttons if the user is not authenticated
                      <a className='signup-btn-a' href={`/login`}>
                      {/* <button type="button" className="btn btn-outline-primary mr-4 login-btn">Log In</button> */}
                      <button type="button" className="btn btn-primary signup-btn mr-4">Log In</button>
                    </a>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
                        <div className="footer-container">
        {/* Render the child components */}
        {props.children}
        {/* Footer */}
        <footer className="p-3 home-background footer">
          <div className='d-flex footer-links' >
            <p className="me-3 mb-0 text-secondary">Reddit Clone</p>
            <a href='https://github.com/Marcus-Ayers/reddit-app-v2.git' target='_blank'>
            <p className='github text-secondary' >GitHub</p>
            </a>
          </div>
        </footer>
                  </div>
    </React.Fragment>
  );
};

export default Layout;
