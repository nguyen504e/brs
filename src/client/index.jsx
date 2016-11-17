import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import './styles/index.scss'

var mountNode = document.getElementById('app')
ReactDOM.render(<App name="Jane" />, mountNode)
