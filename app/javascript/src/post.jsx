import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

const Post = (props) => {
  const [post, setPost] = useState([]);
  const [subreddit, setSubreddit] = useState([]);
  const [comment, setComment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then((data) => {
        setUsername(data.username);
        setAuthenticated(data.authenticated);
      })
      .catch((error) => {
        console.error("XYXYXYXYXYXYXYXYXYYXYXYXYXYY " + error);
      });

    fetch(`/api/subreddits/${props.subreddit_id}`)
      .then(handleErrors)
      .then((data) => {
        // console.log(data)
        setSubreddit(data.subreddit);
        setLoading(false);
      });

    fetch(`/api/subreddits/${props.subreddit_id}/posts/${props.post_id}`)
      .then(handleErrors)
      .then((data) => {
        setPost(data.post);
        setLoading(false);
      });

    // fetch(`/api/subreddits/${props.subreddit_id}/posts`)
    //   .then(handleErrors)
    //   .then((data) => {
    //     setLoading(false);
    //   });

    fetch(`/api/subreddits/${props.subreddit_id}/posts/${props.post_id}/comments`)
      .then(handleErrors)
      .then((data) => {
        // console.log(data.comments.length)
        setComment(data.comments)
        setLoading(false);
      });

  }, [props.subreddit_id, props.post_id]);

  const removePost = (e) => {
    fetch(`/api/subreddits/${props.subreddit_id}/posts/${props.post_id}`, safeCredentials({
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
      setState({
          error: 'Sorry, there was a problem deleting the post. Please try again later.'
      });
  });
  };

  if (loading) {
    return <p>loading...</p>;
  }

  const description = subreddit?.description;
  const name = subreddit?.name;
  const id = post?.id;
  const title = post?.title;
  const body = comment?.body;
  const date = new Date(post?.created_at);
  const dateToString = date?.toLocaleString();
  const postUser = post?.user ? post.user.username : "";
  const username2 = post?.user?.username;
  const comment1 = comment[0]?.body;

  return (
    <Layout>
       <div className="container">
          <div className="row">
            <div className=" col-7 mr-5 mb-3 post-background">
              <div className="">
              <div className="mb-3">
              <a href={`/user/${post?.user?.id}`}>
              <p className='post-info'>Posted by u/{post?.user?.username} - {dateToString}</p>
              </a>
              {username === postUser &&
              <a href={'/subreddit/1'} >
                  <button type="button" className="btn btn-danger delete-post-button " onClick={removePost} >delete</button>
              </a>
                }
                <h3 className="mb-0 post-title-big">{title}</h3>
                <p className="mb-0 post-description"><small><b>{post?.body}</b></small></p>
              </div>
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

            <div className="row">
                <div className="col-7 post-background">
                <div className="form-group">
                    <label className='post-title-big' htmlFor="title">Create Comment</label>
                    {/* <input type="text" className="form-control text-white" id="title" name="title"/> */}
                    <textarea type='text' className='form-control text-white' id='title' name='title' rows='5' />
                  </div>
                {
                  comment.reverse().map(comment => {
                    // console.log(comment)
                    return (
                      <div key={comment.id} className="">
                        <div className="container">
                          <div className="row comment-container">
                            <div className="p-0">
                              <img src='https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png' className='comment-image'></img>
                            </div>
                            <div className="col p-0">
                            <a href={`/user/${post.user.id}`}>
                              <p className='comment-username'>u/{comment.user.username}</p>
                            </a>
                              <p className='comment'>{comment.body}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
                </div>
            </div>
        </div>
    </Layout>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('params');
  const data = JSON.parse(node.getAttribute('data-params'));

  ReactDOM.render(
    <Post subreddit_id={data.subreddit_id} post_id={data.post_id} />,
    document.body.appendChild(document.createElement('div')),
  );
});
