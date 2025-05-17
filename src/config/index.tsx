import React from 'react';
import { createRoot } from 'react-dom/client';
import Config from './config'; 

const container = document.getElementById('kintonePlugin');
if (container) {
  const kintonePlugin = createRoot(container);
  kintonePlugin.render(
    <React.StrictMode>
      <Config />
    </React.StrictMode>
  );
}
