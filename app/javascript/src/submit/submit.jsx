import React, { useState, useEffect } from 'react';
import Layout from '@src/layout';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';

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
          <div className="row">
            <div className="col-12 col-md-9 col-lg-6 mx-auto my-4">
              <div className="border p-4">
                <h1>Make a post</h1>
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Submit;
