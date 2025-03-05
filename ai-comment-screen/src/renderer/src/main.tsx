import { Amplify } from 'aws-amplify'
import React from 'react'
import ReactDOM from 'react-dom/client'
import outputs from '../../../amplify_outputs.json'
import App from './App'
// import './assets/index.css'

Amplify.configure(outputs)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
