import React, { useState, useEffect } from 'react';
import Layout from '@src/layout';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './submit.scss'

const Submit = () => {
  const [subreddits, setSubreddits] = useState([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState("");
  const [userId, setUserId] = useState('')
  const [authenticated, setAuthenticated] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState("post");


  
  useEffect(() => {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(data => {
        setUserId(data.id)
        setAuthenticated(data.authenticated);
        setLoading(false);
      });

      fetch('/api/subreddits')
      .then((response) => response.json())
      .then((data) => {
        setSubreddits(data.subreddits);
        setLoading(false);
      });
  }, []);
  
  const handleSubredditChange = (event) => {
    setSelectedSubreddit(event.target.value);
  };


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

    if (!selectedSubreddit) {
      alert("Please choose a community before submitting.");
      return;
    }
    // fetch(`/api/subreddits/${subredditId}/posts`, {
      fetch(`/api/subreddits/${selectedSubreddit}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        title,
        body,
        // user_id: userId,
        // subreddit_id: 3,
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

  const selectPostFormat = () => {
    setSelectedFormat("post");
  };
  
  const selectImageFormat = () => {
    setSelectedFormat("image");
  };
  

  if (loading) {
    return <p>loading...</p>;
  }
  if (authenticated) {
    return (
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-8 mx-auto mt-5 mb-2 p-0 header">
              <h4 className='mb-3' >Create a post</h4>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-2"></div>
              <select className='dropdown' value={selectedSubreddit} onChange={handleSubredditChange}>
                {!selectedSubreddit && <option value="">Choose a community</option>}
                {subreddits?.map((subreddit) => (
              <option key={subreddit?.id} value={subreddit?.id}>
                {subreddit?.name}
              </option>
            ))}
          </select>
          </div>
          <div className="row mt-2 post-container-buttons">
            <div className={`col-4 ml-auto left-button-background ${selectedFormat === "post" ? "active-format" : "inactive-format"} onClick={selectPostFormat}`} onClick={selectPostFormat} >
                <h3 className='d-flex left-button'>Post</h3>
            </div>
            <div className={`col-4 mr-auto right-button-background ${selectedFormat === "image" ? "active-format" : "inactive-format"} onClick={selectImageFormat}`} onClick={selectImageFormat}>
              <h3 className='d-flex right-button'>Image</h3>
            </div>
          </div>
          <div className="row ">
            <div className="col-8 mx-auto post-container">
              <form onSubmit={handleSubmit}>

                  <textarea 
                  className="form-control textarea-border text-white mb-3 mt-3" 
                  name='title' 
                  id='title' 
                  placeholder='Title' 
                  value={title} 
                  onChange={handleChange} 
                  rows='1' 
                  required />
                  {selectedFormat === 'post' ? (
                    <textarea 
                    className="form-control textarea-border body text-white" 
                    id='body' 
                    name='body' 
                    placeholder='Text (optional)' 
                    value={body} 
                    onChange={handleChange} 
                    rows='7'  />
                  ) : (
                    <input
                        type="file"
                        id="image"
                        name="image"
                        className="form-control-file"
                        accept="image/*"
                      />
                  )}
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
