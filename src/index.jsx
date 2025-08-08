import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import outputs from '../amplify_outputs.json';
import { worker } from './mocks/browser';

Amplify.configure(outputs);

await worker.start();

//Per https://stackoverflow.com/a/78608514
const router = createBrowserRouter(createRoutesFromElements(<Route path='*' element={<App />} />));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Authenticator hideSignUp>
      <RouterProvider router={router}/>
    </Authenticator>
  </React.StrictMode>
);
