import React, { useState } from 'react';
import { handleErrors } from '@utils/fetchHelper';

const CreatePost = ({ userId, subredditId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');


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
        setIsOpen(false);
        setTitle('');
        setBody('');
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
        window.alert("You need to be logged in to create a post");
      });
  };

  const navToSubmit = () => {
    const queryParams = subredditId ? `?subredditId=${subredditId}` : '';
    window.location.href = `/submit${queryParams}`;
  };
  
  return (
    <div className="container">
      <div className="row">
          <div className="col create-post-link mt-3 mb-3 d-flex align-items-center">
            <img src="https://www.redditstatic.com/avatars/avatar_default_02_94E044.png" alt="Italian Trulli" className="profile-pic"></img>
            <input type="text" className="create-post mx-auto" onClick={navToSubmit} placeholder="Create Post" />

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
