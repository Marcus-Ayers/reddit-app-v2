import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';
import CreatePost from './create_post';
import { getTimeAgo } from './timeUtils';

const Home = (props) => {
  const [posts, setPosts] = useState([]);
  const [subreddits, setSubreddits] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleDropdown = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'description') {
      setDescription(value);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    fetch('/api/subreddits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        name,
        description,
      }),
    })
      .then(handleErrors)
      .then(data => {
        setIsOpen(false);
        setName('');
        setDescription('');
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
        window.alert("You need to be logged in to create a subreddit");
      });
  };

  useEffect(() => {
    fetch(`/api/posts/all`)
      .then(handleErrors)
      .then((data) => {
        setPosts(data.posts);
        setAuthenticated(data.authenticated);
        setLoading(false);
      })
      .catch((error) => {
        console.error("XYXYXYXYXYXYXYXYXYYXYXYXYXYY " + error);
      });

    fetch(`/api/subreddits`)
      .then(handleErrors)
      .then((data) => {
        setSubreddits(data.subreddits);
        setAuthenticated(data.authenticated);
        setLoading(false);
      })
      .catch((error) => {
        console.error("XYXYXYXYXYXYXYXYXYYXYXYXYXYY " + error);
      });
  }, []);



  return (
    <Layout>
      <div className="container background">
          <div className="row home-layout">
            <div className="col-sm-12 col-md-12 col-lg-7  mr-5 content">
              <CreatePost />
              <div className="posts123">
              {posts.length === 0 ? (
                  <h6 className='text-white' >There are no posts yet.</h6>
                ) : (
                  posts.map(post => {
                    const timeAgo = getTimeAgo(post.created_at);
                    return (
                      <div key={post.id} className="col-6 col-lg-4 mb-3 post">
                        <div className="post-header">
                          <a href={`/subreddit/${post.subreddit?.id}`} className="text-body text-decoration-none">
                            <p className='subreddit-name'>r/{post.subreddit?.name} </p>
                          </a>
                          <a href={`/user/${post.user.id}`}>
                            <p className='post-info user-name'>Posted by u/{post.user.username} - {timeAgo}</p>
                          </a>
                        </div>
                        <a className='text-decoration-none' href={`subreddit/${post.subreddit?.id}/post/${post.id}`}>
                          <h6 className="mb-2 post-title">{post.title}</h6>
                          {post.image && <img src={post.image} alt={post.title} className="post-image pt-3" />}
                        </a>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
            <div className="col-7 col-sm-6 col-md-6 col-lg-3 info">
                <img className='home-banner-image' src='https://www.redditstatic.com/desktop2x/img/id-cards/home-banner@2x.png'></img>
              <div className="home-container d-flex">
                <img className='home-image pl-3' src='https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png'></img>
                <h5 className='pl-3 d-flex home'>Home</h5>
              </div>
              <p className='home-text pl-3'>Your personal Reddit frontpage. Come here to check in with your favorite communities.</p>
              <div className="sub-button-container">
        <button type="button" className="btn btn-light create-subreddit-button " onClick={toggleDropdown}> Create Subreddit </button>
        <a className='button-anchor' href='/submit'>
        <button type="button" className='btn btn-outline-secondary my-3  create-post-button'>Create Post</button>
        </a>
        {isOpen && (
          <div className="dropdown-menu">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className='text-white'  htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control text-white"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className='text-white' htmlFor="description">Description</label>
                <textarea
                  className="form-control text-white"
                  id="description"
                  name="description"
                  rows="3"
                  value={description}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </form>
          </div>
        )}
      </div>
            </div>
          </div>
        </div>
    </Layout>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Home />,
    document.body.appendChild(document.createElement('div')),
  );
});
