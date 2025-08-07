import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './components/MainPage'
import Journal from './components/Journal'
import TitleSelectorPage from './components/TitleSelectorPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/journal/:itemId" element={<Journal />} />
          <Route path="/title-selector" element={<TitleSelectorPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App