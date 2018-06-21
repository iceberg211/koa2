import React, { Component } from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './views/app'

const root = document.getElementById('root')

render(<BrowserRouter>
  <App />
</BrowserRouter>, root)
