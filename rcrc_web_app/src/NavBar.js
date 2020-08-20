import React from 'react';
import { Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

export default function MyNavigationBar ({useruserid}) {

  return (
  <Navbar className="navbar-custom">
    <NavLink exact className = "nav-link" activeClassName="nav-link-active" to="/home">
      <img className = "logo" src={require('./logo.png')} alt="logo"/>
    </NavLink>
    <NavLink exact className = "nav-link" activeClassName="nav-link-active" to={"/user-profile/"+useruserid}>User Profile</NavLink>
    <NavLink exact className = "nav-link" activeClassName="nav-link-active" to="/list-jobs">Search Jobs</NavLink>
  </Navbar>
  );
}

