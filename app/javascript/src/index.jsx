import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './home';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  createRoot(container).render(<Home />);
});
