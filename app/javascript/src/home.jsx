import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';

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
        console.log(data);
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
      // .then(data => {
      //   setState(prevState => ({
      //     ...prevState,
      //     posts: data.posts,
      //     loading: false,
      //   }));
      // });
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
      // .then(data => {
      //   setState(prevState => ({
      //     ...prevState,
      //     subreddits: data.subreddits,
      //     loading: false,
      //   }));
      // });
      .then((data) => {
        setSubreddits(data.subreddits);
        setAuthenticated(data.authenticated);
        setLoading(false);
      })
      .catch((error) => {
        console.error("XYXYXYXYXYXYXYXYXYYXYXYXYXYY " + error);
      });
  }, []);

  // const { posts, subreddits, isOpen, name, description } = state;

  return (
    <Layout>
      <div className="container background">
          <div className="row">
            <div className="col-7 mr-5 content">
              <h1 className='home-page-banner'> Home </h1>
              <div className="posts123">
              {posts.length === 0 ? (
                  <h6 className='text-white' >There are no posts yet.</h6>
                ) : (
              posts.map(post => {
                    const date = new Date(post.created_at)
                    const dateToString = date.toLocaleString();
                    // console.log(post)
              return (
                <div key={post.id} className="col-6 col-lg-4 mb-3 post">
                  <div className="post-header">

                  <a href={`/subreddit/${post.subreddit?.id}`} className="text-body text-decoration-none">
                  <p className='subreddit-name'>r/{post.subreddit?.name} </p>
                  </a>
                  <a href={`/user/${post.user.id}`}>
                  <p className='post-info user-name'>Posted by u/{post.user.username} - {dateToString}</p>
                  </a>
                  </div>
                  <a href={`subreddit/${post.subreddit?.id}/post/${post.id}`}>
                    <h6 className="mb-3 post-title">{post.title}</h6>
                  </a>
                </div>
              )
            })
                )}
                
              </div>
            </div>
            <div className="col-4 info">
              <h1 className='subreddits-header text-danger'>Subreddits</h1>
              {subreddits.map(subreddit => (
                <div key={subreddit.id} className="sub-names">
                  <a href={`/subreddit/${subreddit.id}`} className="subreddit-name">
                    <p>r/{subreddit.name}</p>
                  </a>
                </div>
              ))}
              <div className="dropdown sub-button-border">
        <button
          type="button" className="btn btn-light create-subreddit-button"
          onClick={toggleDropdown}
        >
          Create Subreddit
        </button>
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
