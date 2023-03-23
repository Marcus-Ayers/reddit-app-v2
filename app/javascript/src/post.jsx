import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

const Post = (props) => {
  const [body, setBody] = useState('');
  const [post, setPost] = useState(null);
  const [image, setImage] = useState(null);
  const [subreddit, setSubreddit] = useState(null);
  const [comment, setComment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [id, setId] = useState('')
  const [authenticated, setAuthenticated] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);


  // ------------FETCH REQUESTS AND SETTING THE STATE------------
  useEffect(() => {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then((data) => {
        setId(data.id)
        setUsername(data.username);
        setAuthenticated(data.authenticated);
      })
      .catch((error) => {
        console.error("XYXYXYXYXYXYXYXYXYYXYXYXYXYY " + error);
      });

    fetch(`/api/subreddits/${props.subreddit_id}`)
      .then(handleErrors)
      .then((data) => {
        setSubreddit(data.subreddit);
        setLoading(false);
      });

    fetch(`/api/subreddits/${props.subreddit_id}/posts/${props.post_id}`)
      .then(handleErrors)
      .then((data) => {
        setImage(data.post.image)
        setPost(data.post);
        setLoading(false);
      });

    fetch(`/api/subreddits/${props.subreddit_id}/posts/${props.post_id}/comments`)
      .then(handleErrors)
      .then((data) => {
        setComment(data.comments.reverse())
        setLoading(false);
      });

  }, [props.subreddit_id, props.post_id]);

// ------------FUNCTION TO REMOVE A POST------------
  const removePost = (e) => {
    fetch(`/api/subreddits/${props.subreddit_id}/posts/${props.post_id}`, safeCredentials({
      method: 'DELETE',
  }))
  .then(response => {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response.json();
  })
  .then(data => {
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

  // ------------FUNCTION TO REMOVE A COMMENT------------
  const removeComment = (comment_id) => {
    fetch(`/api/subreddits/${props.subreddit_id}/posts/${props.post_id}/comments/${comment_id}`, safeCredentials({
      method: 'DELETE',
    }))
    .then(response => {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      //------------UPDATES THE STATE WHEN THE COMMENT IS REMOVED------------
      if (data.success) {
        setComment(comment.filter(c => c.id !== comment_id));
      }
    })
    .catch(error => {
      console.error(error);
      setState({
          error: 'Sorry, there was a problem deleting the comment. Please try again later.'
      });
    });
  };
  
  // ------------EVENT HANDLER FOR COMMENTS FORM------------
  const handleChange = event => {
    const { name, value } = event.target;
    if (name === 'body') {
      setBody(value);
    } 
  };
  // ------------FUNCTION THAT UPDATES THE STATE WHEN A COMMENT IS POSTED------------
  const handleSubmit = event => {
    event.preventDefault();
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  
    fetch(`/api/subreddits/${props.subreddit_id}/posts/${props.post_id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        comment: {
          body: body,
        },
      }),
    })
      .then(handleErrors)
      .then(data => {
        const newComment = {
          id: data.id,
          body: data.body,
          user: {
            username: username,
          },
        };
        //------------SPREAD THE STATE AND ADD THE 'newComment' SO IT DISPLAYS WITHOUT PAGE REFRESH------------
        setComment([...comment, newComment]);
        setBody('');
      })
      .catch(error => {
        console.log(error);
        window.alert("You need to be logged in to create a comment");
      });
  };
  //------------CHECKS IF YOU ARE EDITING A COMMENT------------
  const startEditing = (commentId) => {
    setEditingCommentId(commentId);
  };
//------------TOGGLES DROPDOWN FOR EDIT/DELETE------------
  const toggleDropdown = (commentId) => {
    setOpenDropdownId(openDropdownId === commentId ? null : commentId);
  };
//------------PATCH THAT SAVES A COMMENT AFTER EDIT------------
  const saveComment = (commentId, updatedBody) => {
    fetch(`/api/subreddits/${props.subreddit_id}/posts/${props.post_id}/comments/${commentId}`, safeCredentials({
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: { body: updatedBody } }),
    }))
      .then(handleErrors)
      .then(data => {
        const updatedComments = comment.map(c => c.id === commentId ? { ...c, body: updatedBody } : c);
        setComment(updatedComments);
        setEditingCommentId(null);
      })
      .catch(error => {
        console.error(error);
        alert('There was a problem updating the comment. Please try again later.');
      });
  };
  

  if (loading) {
    return <p>loading...</p>;
  }

  const description = subreddit?.description;
  const name = subreddit?.name;
  const title = post?.title;
  const date = new Date(post?.created_at);
  const dateToString = date?.toLocaleString();
  const postUser = post?.user ? post.user.username : "";

  return (
    <Layout>
       <div className="container">
          <div className="row home-layout">
            {/* ------------SHOWS THE POST CONTENTS------------- */}
            <div className=" col-7 mr-5 mb-3 post-background">
              <div className="">
              <div className="mb-3">
                <div className="post-header">
                   <a href={`/subreddit/${post?.subreddit?.id}`} className="text-body text-decoration-none">
                     <p className='subreddit-name'>r/{subreddit?.name} </p>
                   </a>
                    <a href={`/user/${post?.user?.id}`}>
                      <p className='post-info user-name'>Posted by u/{post?.user?.username} - {dateToString}</p>
                    </a>
                </div>
              {username === postUser &&
              <a href={'/subreddit/1'} >
                  <button type="button" className="btn btn-danger delete-post-button " onClick={removePost} >delete</button>
              </a>
                }
                <h3 className="mb-0 post-title-big">{title}</h3>
                {image && <img src={image} alt={title} className="post-image pt-3" />}
                <p className="mb-0 post-description"><small><b>{post?.body}</b></small></p>
              </div>
              </div>
            </div>
            {/* ----------THE SUBREDDIT INFO BOX TO THE RIGHT------------ */}
            <div className="col-3 info">
              <div className="info-box-container">
              <img src='https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png' className='info-box-image ml-3 mt-3'></img>
              <h2 className='name-infobox'>r/{name || "N/A"}</h2>
              </div>
              <p className='description-infobox ml-3'>{description || "N/A"}</p>
            </div>
          </div>
          {/* ------------COMMENTS SECTION-------------- */}
            <div className="row">
              <div className="col-1 p-0"></div>
                <div className="col-7 post-background comments-layout">
                  <div className="form-group form-bottom-border">
                    <form onSubmit={handleSubmit}>
                    <label className='comment-header ml-1' htmlFor="title">
                      {authenticated ? (
                        <>Comment as 
                          <span className="username-color ml-1">
                            <a href={`/user/${id}`}>
                              {username}
                            </a>
                          </span>
                        </>
                      ) : (
                        "Log in to comment"
                      )}
                    </label>
                      <div className="comment-box">
                        <textarea type='text' className='form-control text-white no-border' id='title' name='body' placeholder='What are your thoughts?' rows='5' value={body} onChange={handleChange} />
                        <div className="comment-tools">
                          <button className='btn btn-light comment-button' type='submit'>Submit</button>
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* MAPS THROUGH ALL THE COMMENTS FOR THE POST */}
                  {comment.map((comment, index) => {
                    const isEditing = editingCommentId === comment?.id;
                    return (
                      <div key={comment?.id || index} className="">
                        <div className="container">
                          <div className="row comment-container">
                            <div className="col p-0">
                              <div className="icon-name-container">
                            <img src="https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png" className="comment-image"></img>
                              <a className='d-flex align-items-center' href={`/user/${post?.user?.id}`}>
                                <p className="comment-username">u/{comment?.user?.username}</p>
                              </a>
                              </div>
                              {isEditing ? (
                                <div className="editing-container">
                                  <textarea className="form-control text-white" id={`comment-${comment.id}`} defaultValue={comment?.body} rows='5' onBlur={(e) => saveComment(comment?.id, e.target.value)} />
                                <div className="comment-tools">
                                {isEditing && (
                                  <button
                                    className="btn btn-light comment-button save-comment-button" onClick={() =>
                                      saveComment(comment?.id, document.querySelector(`#comment-${comment.id}`).value)}>Save
                                  </button>
                                )}
                                </div>
                                </div>
                              ) : (
                                <p className="comment">{comment?.body}</p>
                              )}
                            </div>
                            {username === comment?.user?.username && (
                              <>
                                <div className="dropdown">
                                  {!isEditing && (
                                    <i className="fas fa-ellipsis-v toggle-button" onClick={() => toggleDropdown(comment.id)}></i>
                                  )}
                                  {openDropdownId === comment.id && (
                                    <div className="dropdown-menu">
                                      <a className="dropdown-item" onClick={() => {startEditing(comment?.id); setOpenDropdownId(null)}}>Edit </a>
                                      <a className="dropdown-item" onClick={() => {removeComment(comment?.id); setOpenDropdownId(null)}}> Delete </a>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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