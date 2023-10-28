import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
  return (
    <div className="container">
      <nav className="navigation">
        <div className="navigation-header">
          <h1>Attendance Control</h1>
        </div>
        <ul className="navigation-list">
          <li className="navigation-item">
            <Link to="/monthly-records" className="navigation-link">
              Monthly Records
            </Link>
          </li>
          <li className="navigation-item">
            <Link to="/daily-records" className="navigation-link">
              Daily Records
            </Link>
          </li>
        </ul>
        <hr className="navigation-divider" />

        <ul className="navigation-list">
          <li className="navigation-item">
            <Link to="/administration" className="navigation-link">
              Manage profiles
            </Link>
          </li>
        </ul>
        <div className="github-link">
          <a
            href="https://github.com/chapovskii"
            target="_blank"
            rel="noopener noreferrer"
            className="rainbow-text"
          >
            My GitHub
          </a>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
