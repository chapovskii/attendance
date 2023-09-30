import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const loggedInUser = "testUserLabel";

function Navigation() {
  return (
    <div className="container">
      <nav className="navigation">
        <div className="navigation-header">
          <h1>Attendance Control</h1>
          <p>Logged in as: {loggedInUser}</p>
        </div>
        <ul className="navigation-list">
          <li className="navigation-item">
            <Link to="/" className="navigation-link">
              Home
            </Link>
          </li>
          <li className="navigation-item">
            <Link to="/monthly-records" className="navigation-link">
              Monthly rRecords
            </Link>
          </li>
          <li className="navigation-item">
            <Link to="/daily-records" className="navigation-link">
              Daily Records
            </Link>
          </li>
        </ul>
        <hr className="navigation-divider" />
        <div className="github-link">
          <a
            href="https://github.com/your-github-repo-link"
            target="_blank"
            rel="noopener noreferrer"
            className="navigation-link"
          >
            GitHub
          </a>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
