import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';
import Create_post from './create_post';

const Subreddit = (props) => {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null)
  const [subreddit, setSubreddit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`/api/subreddits/${props.subreddit_id}`)
      .then(handleErrors)
      .then((data) => {
        setSubreddit(data.subreddit);
        setAuthenticated(data.authenticated);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
    
    fetch(`/api/subreddits/${props.subreddit_id}/posts`)
      .then(handleErrors)
      .then((data) => {
        setPosts(data.posts);
        setAuthenticated(data.authenticated);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (loading) {
    return <p>loading...</p>;
  }

  const description = subreddit?.description;
  const name = subreddit?.name;

  
  return (
    <Layout>
      <div className="container background">
          <div className="row">
            <div className="col-7 mr-5 content">
              <Create_post subredditId={props.subreddit_id}/>
              <div className="posts123">
                {posts.length === 0 ? (
                  <h6 className='text-white' >There are no posts in this subreddit yet.</h6>
                ) : (
                  posts.map(post => {
                    const date = new Date(post.created_at)
                    const dateToString = date.toLocaleString();
                    return (
                      <div key={post.id} className="col-6 col-lg-4 mb-3 post">
                        <div className="post-header">
                          <a href={`/subreddit/${subreddit.id}`} className="text-body text-decoration-none">
                            <p className='subreddit-name'>r/{post.subreddit.name} </p>
                          </a>
                          <a href={`/user/${post.user.id}`}>
                            <p className='post-info user-name'>Posted by u/{post.user.username} - {dateToString}</p>
                          </a>
                        </div>
                        <a href={`${props.subreddit_id}/post/${post.id}`}>
                          <h6 className="mb-3 post-title">{post.title}</h6>
                          {post.image && <img src={post.image} alt={post.title} className="post-image pt-3" />}
                        </a>                  
                      </div>
                    )
                  })
                )}
              </div>
            </div>
            <div className="col-4 info">
              <div className="info-box-container">
                <img src='https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png' className='info-box-image ml-3 mt-3'></img>
                <h3 className='name-infobox'>{name}</h3>
              </div>
              <p className='description-infobox ml-3'>{description}</p>
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
    <Subreddit subreddit_id={data.subreddit_id} />,
    document.body.appendChild(document.createElement('div')),
  );
});
