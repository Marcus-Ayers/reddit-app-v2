import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      name: '',
      description: '',
      posts: [],
      subreddits: [],
    }
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleDropdown() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, description } = this.state;
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
      .then((data) => {
        console.log(data);
        this.setState({
          isOpen: false,
          name: '',
          description: '',
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error)
        window.alert("You need to be logged in to create a subreddit");

      });
  };
  
  
  componentDidMount() {
    fetch(`/api/posts/all`)
      .then(handleErrors)
      .then(data => {
        // console.log(data)
        this.setState({
          posts: data.posts,
          loading: false,
          
        })
      })  

      fetch(`/api/subreddits`)
      .then(handleErrors)
      .then(data => {
        // console.log(data)
        this.setState({
          subreddits: data.subreddits,
          loading: false,
        })
      }) 
  }
  

  render () {
    const {posts, subreddits, isOpen, name, description } = this.state;
  //   const date = new Date(post.created_at)
  //  const dateToString = date.toLocaleString();
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
          onClick={this.toggleDropdown}
        >
          Create Subreddit
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label className='text-white'  htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control text-white"
                  id="name"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
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
                  onChange={this.handleChange}
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
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Home />,
    document.body.appendChild(document.createElement('div')),
  )
})