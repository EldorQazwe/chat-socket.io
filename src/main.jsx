import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import io from "socket.io-client";

const socket = io({transports: ["websocket"]});

ReactDOM.createRoot(document.getElementById('root')).render(
    <App socket={socket}/>
)
