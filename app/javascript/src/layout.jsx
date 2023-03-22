import React, { useState, useEffect } from 'react';
import './layout.scss';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';


const Layout = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState([]);
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
      console.log(data.subreddits)
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
          console.log(data)
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
            <div key={suggestion.id} className="search-result-item">
              <a href={`/subreddit/${suggestion.id}`}>{suggestion.name}</a>
            </div>
          ))}
          <p className='hint'> Hint: Type 'all' to see all subreddits</p>
        </div>
      )}
      {searchResults.length > 0 && !showSuggestions && (
        <div className="search-results-dropdown">
          {searchResults.map((result) => (
            <div key={result.id} className="search-result-item">
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
        // console.log(data);
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
            {searchBox}

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
                        <div className="footer-container">
        {/* Render the child components */}
        {props.children}
        {/* Footer */}
        <footer className="p-3 home-background footer">
          <div>
            <p className="me-3 mb-0 text-secondary">Reddit Clone</p>
          </div>
        </footer>
                  </div>
    </React.Fragment>
  );
};

export default Layout;
