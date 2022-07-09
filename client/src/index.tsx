import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './style/index.css';
// @ts-ignore
import App from './components/App.tsx';
import "@vkontakte/vkui/dist/vkui.css";
import "./style/refresh-vkui.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

