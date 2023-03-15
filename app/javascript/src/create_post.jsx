import React, { useState } from 'react';
import { handleErrors } from '@utils/fetchHelper';

const CreatePost = ({ userId, subredditId }) => {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    body: '',
  });

  const toggleDropdown = () => {
    setState(prevState => ({ ...prevState, isOpen: !prevState.isOpen }));
    if (!state.isOpen) {
      setTimeout(() => {
        document.getElementById('title').focus();
      }, 0);
    }
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    const { title, body } = state;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    fetch(`/api/subreddits/${subredditId}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        title,
        body,
        user_id: userId,
        subreddit_id: subredditId,
      }),
    })
      .then(handleErrors)
      .then(data => {
        console.log(data);
        setState({
          ...state,
          isOpen: false,
          title: '',
          body: '',
        });
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
        window.alert("You need to be logged in to create a post");
      });
  };

  const { isOpen, title, body } = state;

  return (
    <div className="container">
      <div className="row">
          <div className="col create-post-button mt-3 mb-3 d-flex align-items-center">
            <img src="https://www.redditstatic.com/avatars/avatar_default_02_94E044.png" alt="Italian Trulli" className="profile-pic"></img>
            <input type="text" className="create-post mx-auto" onClick={toggleDropdown} placeholder="Create Post" />

            {isOpen && (
              <div className="dropdown-menu">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className='post-title-big' htmlFor="title">Title</label>
                    <input type="text" className="form-control text-white" id="title" name="title" value={title} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label className='post-title-big' htmlFor="body">Body</label>
                    <textarea className="form-control text-white" id="body" name="body" rows="3" value={body} onChange={handleChange} required></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default CreatePost;
