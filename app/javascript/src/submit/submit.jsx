import React, { useState, useEffect } from 'react';
import Layout from '@src/layout';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './submit.scss'

const Submit = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(data => {
        setAuthenticated(data.authenticated);
      });
  }, []);

  if (authenticated) {
    return (
      <Layout>
        <div className="container">
          <div className="row mt-5 post-container-buttons">
            <div className="col-4 ml-auto left-button-background">
                <h3 className='d-flex left-button' >Post</h3>
            </div>
            <div className="col-4 mr-auto right-button-background">
              <h3 className='d-flex right-button' >Image</h3>
            </div>
          </div>
          <div className="row ">
            <div className="col-8 mx-auto post-container">
              <textarea className="form-control textarea-border text-white mb-3 mt-3" placeholder='Title' rows='1'  />
              <textarea className="form-control textarea-border body text-white" placeholder='Text (optional)' rows='5'  />
            <div className="container buttons">
              <button type="button" className="btn btn-light ml-2 post-button"> Post </button>
              <button type="button" className="btn btn-outline-secondary draft-button"> Save Draft </button>
            </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-9 col-lg-6 mx-auto my-4">
            <div className="border p-4">
              <h1>Please log in to make a post</h1>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Submit;
