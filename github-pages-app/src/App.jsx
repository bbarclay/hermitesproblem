import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'katex/dist/katex.min.css'
import './App.css'

// Pages
import Home from './pages/Home'
import Paper from './pages/Paper'
import Methods from './pages/Methods'
import Interactive from './pages/Interactive'
import Testing from './pages/Testing'
import Resources from './pages/Resources'

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="/">Hermite's Problem</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className={({isActive}) => isActive ? "nav-link active" : "nav-link"} to="/">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => isActive ? "nav-link active" : "nav-link"} to="/paper">Paper</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => isActive ? "nav-link active" : "nav-link"} to="/methods">Methods</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => isActive ? "nav-link active" : "nav-link"} to="/interactive">Interactive</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => isActive ? "nav-link active" : "nav-link"} to="/testing">Testing</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => isActive ? "nav-link active" : "nav-link"} to="/resources">Resources</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/paper" element={<Paper />} />
            <Route path="/methods" element={<Methods />} />
            <Route path="/interactive" element={<Interactive />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </div>

        <footer className="footer mt-5 pt-4 border-top text-center text-muted">
          <div className="container">
            <p>© 2025 Brandon Barclay</p>
            <p>Department of Mathematics • University</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
