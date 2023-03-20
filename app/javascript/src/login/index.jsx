// import React from 'react'
// import ReactDOM from 'react-dom'
// import Login from './login';

// document.addEventListener('DOMContentLoaded', () => {
//   ReactDOM.render(
//     <Login />,
//     document.body.appendChild(document.createElement('div')),
//   )
// })
import React from 'react';
import { createRoot } from 'react-dom/client';
import Login from './login';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  createRoot(container).render(<Login />);
});
