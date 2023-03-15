import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';

class User extends React.Component {
  state = {
    post: [],
    user: {},
    loading: true,
    posts: [],
    subreddits: [],
  }

  componentDidMount() {
    fetch(`/api/users/${this.props.user_id}`)
      .then(handleErrors)
      .then(data => {
        this.setState({
          user: data.user,
          loading: false,
        })
      })
      
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
    const { user, loading, posts, subreddits } = this.state;
    if (loading) {
      return <p>loading...</p>;
    };

    const {
      id,
      username,
      email,
    } = user

    return (
      <Layout>
        <div className="container">
          <div className="col-12">
            <div className="row user-page">
              <h1 className='user-page-info'>{username}</h1>
              <div className="row user-page2">
              <p className='user-page-info'>{email}</p>
              </div>


            <div className="container">
              <div className="col-12">
                <div className="row user-posts user-posts-border">

                
              <h1 className='user-page-info'>{username}'s posts</h1>
              </div>
              <div className="row user-posts">

              {posts.map(post => {
                if (post.user.id == this.props.user_id) {
                    const date = new Date(post.created_at)
                    const dateToString = date.toLocaleString();
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
                  <a href={`/subreddit/${post.subreddit?.id}/post/${post.id}`}>
                    <h6 className="mb-3 post-title">{post.title}</h6>
                  </a>
                </div>
              )
                }
            })}
              </div>
              </div>
              </div>
              </div>




          </div>
        </div>
      </Layout>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('params');
  const data = JSON.parse(node.getAttribute('data-params'));
  console.log(data)

  ReactDOM.render(
    <User user_id={data.user} />,
    document.body.appendChild(document.createElement('div')),
  )
})