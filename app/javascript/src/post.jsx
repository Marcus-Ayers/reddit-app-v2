import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

class Post extends React.Component {


  state = {
    post: [],
    subreddit: [],
    comment: [],
    loading: true,
    username: [],
    authenticated: false,

  }

  componentDidMount() {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(data => {
        // console.log(data)
        this.setState({
          username: data.username,
          authenticated: data.authenticated,
        })
      })
      .catch(error => {
        console.error("XYXYXYXYXYXYXYXYXYYXYXYXYXYY " + error);
      });

    fetch(`/api/subreddits/${this.props.subreddit_id}`)
      .then(handleErrors)
      .then(data => {
        // console.log("hello1")
        this.setState({
          subreddit: data.subreddit,
          loading: false,
        })
      });

    fetch(`/api/subreddits/${this.props.subreddit_id}/posts/${this.props.post_id}`)
      .then(handleErrors)
      .then(data => {

        this.setState({
          post: data.post,
          loading: false,
        })
      })
      fetch(`/api/subreddits/${this.props.subreddit_id}/posts`)
      .then(handleErrors)
      .then(data => {
        this.setState({
          posts: data.posts,
          loading: false,
          
        })
      })

      fetch(`/api/subreddits/${this.props.subreddit_id}/posts/${this.props.post_id}/comments`)
      .then(handleErrors)
      .then(data => {
        this.setState({
          posts: data.posts,
          loading: false,
          
        })
      })
  }



   
  removePost = e => {

    e.preventDefault();
    fetch(`/api/subreddits/${this.props.subreddit_id}/posts/${this.props.post_id}`, safeCredentials({
        method: 'DELETE',
    }))
    .then(response => {
      // console.log(response)
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); 
        if (data.success) {
          window.location.href = '/';
        }
    })
    .catch(error => {
      
        console.error(error);
        this.setState({
            error: 'Sorry, there was a problem deleting the post. Please try again later.'
        });
    });
  }

  
  render () {
    
    const { post, subreddit, loading, comment, username } = this.state;
    if (loading) {
      return <p>loading...</p>;
    };
    const {
      description,
      name,
    } = subreddit 
    
    const {
      id,
      title,
    } = post

   const {
     body,
   } = comment

   const date = new Date(post.created_at)
   const dateToString = date.toLocaleString();
   const postUser = post.user ? post.user.username : "";
   const username2 = post.user?.username 

    return (
      <Layout>
        <div className="container">
          <div className="row">
            <div className=" col-7 mr-5 mb-3 post-background">
              <div className="">
              <div className="mb-3">
              <a href={`/user/${post.user?.id}`}>
              <p className='post-info'>Posted by u/{post.user?.username} - {dateToString}</p>
              </a>
              {username === postUser &&
              <a href={'/subreddit/1'} >
                  <button type="button" className="btn btn-danger delete-post-button " onClick={this.removePost} >delete</button>
              </a>
                }
                <h3 className="mb-0 post-title-big">{title}</h3>
                <p className="mb-0 post-description"><small><b>{post.body}</b></small></p>
              </div>
              <hr />
              </div>
            </div>
            <div className="col-4 info">
              <div className="info-box-container">
              <img src='https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png' className='info-box-image'></img>

              <h2 className='name-infobox'>{name || "N/A"}</h2>
              </div>
              <p className='description-infobox'>{description || "N/A"}</p>
              <h1>{body}</h1>
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
  // console.log(data)
  // console.log("The subreddit ID is " + data.subreddit_id)
  // console.log("The post ID is " + data.post_id)
  ReactDOM.render(
    <Post subreddit_id={data.subreddit_id} post_id={data.post_id} />,
    document.body.appendChild(document.createElement('div')),
  )
})

