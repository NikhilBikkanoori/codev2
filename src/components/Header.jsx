import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const styles = `
    header {
      background: #262C53;
      color: white;
      padding: 15px 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    header h1 {
      background: linear-gradient(135deg, #192047, #A2F4F9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 1.8em;
      font-weight: bold;
      margin: 0;
    }

    nav {
      display: flex;
      gap: 20px;
    }

    nav a {
      color: #fff;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s;
    }

    nav a:hover {
      color: #FFD1D8;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <header>
        <h1>DropShield</h1>
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/students-data">Students Data</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/newadmin">New Admin</Link>
          <Link to="/student-login">Login</Link>
          <a href="#features">Features</a>
          <a href="#stats">Statistics</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
    </>
  );
};

export default Header;