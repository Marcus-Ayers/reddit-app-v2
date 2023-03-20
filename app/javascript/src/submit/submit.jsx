import React, { useState, useEffect } from 'react';
import Layout from '@src/layout';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './submit.scss'

const Submit = () => {
  const[userId, setUserId] = useState('')
  const [authenticated, setAuthenticated] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  
  useEffect(() => {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(data => {
        setUserId(data.id)
        console.log(data)
        setAuthenticated(data.authenticated);
      });
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'body') {
      setBody(value);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // fetch(`/api/subreddits/${subredditId}/posts`, {
      fetch(`/api/subreddits/3/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        title,
        body,
        user_id: userId,
        subreddit_id: 3,
      }),
    })
      .then(handleErrors)
      .then(data => {
        console.log(data);
        setTitle('');
        setBody('');
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
        window.alert("You need to be logged in to create a post");
      });
  };

  if (authenticated) {
    return (
      <Layout>
        <div className="container">
          <div className="row mt-5 post-container-buttons">
            <div className="col-4 ml-auto left-button-background">
                <h3 className='d-flex left-button'>Post</h3>
            </div>
            <div className="col-4 mr-auto right-button-background">
              <h3 className='d-flex right-button'>Image</h3>
            </div>
          </div>
          <div className="row ">
            <div className="col-8 mx-auto post-container">
              <form onSubmit={handleSubmit}>
                  <textarea className="form-control textarea-border text-white mb-3 mt-3" name='title' id='title' placeholder='Title' value={title} onChange={handleChange} rows='1'  />
                  <textarea className="form-control textarea-border body text-white" id='body' name='body' placeholder='Text (optional)' value={body} onChange={handleChange} rows='5'  />
                <div className="container buttons">
                  <button type="submit" className="btn btn-light ml-2 post-button"> Post </button>
                  {/* <button type="button" className="btn btn-outline-secondary draft-button"> Save Draft </button> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-9 col-lg-6 mx-auto my-4">
            <div className="border p-4">
              <h1>Please log in to make a post</h1>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Submit;
