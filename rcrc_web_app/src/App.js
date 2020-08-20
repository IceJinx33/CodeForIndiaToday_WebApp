import React , {useState} from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import MyNavigationBar from './NavBar.js';
import { Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import HomePage from './Home.js';
import JobLister from './JobsList.js'
import User from './UserProfile.js'
import JobDisplay from './JobDisplay.js';
import AppLister from './ApplicationsList.js';
import ApplicantProfile from './ApplicantProfile.js';
import SignUpLogIn from './SignUpLogIn.js';

function App() {

  const [useruserid, setUserUserID] = useState(sessionStorage.getItem("user-userID"));

  const routing = (
    <div>
      <Router>
      {useruserid !== null ? <MyNavigationBar useruserid = {useruserid}/> : 
       <Navbar className="navbar-custom">
       <NavLink exact className = "nav-link" activeClassName="nav-link-active" to="/home">
         <img className = "logo" src={require('./logo.png')} alt="logo"/>
       </NavLink>
       <NavLink exact className = "nav-link" activeClassName="nav-link-active" to="/">
         Sign Up
       </NavLink>
     </Navbar>
     }
      <div>
        <Switch>
        <Route exact path="/" render={() => <SignUpLogIn setSign={setUserUserID}/>}/>
        <Route path="/home" component={HomePage}/>
        <Route path="/list-jobs" component={JobLister} />
        <Route path="/user-profile/:id" render={(props) => <User id={props.match.params.id} setSign={setUserUserID}/>} />
        <Route path="/job-details/:id" render={(props) => <JobDisplay id={props.match.params.id}/>} />
        <Route path="/list-apps/:jobid" render={(props) => <AppLister jobid={props.match.params.jobid}/>}/>
        <Route path="/applicant-profile/:jobid/:userid" render={(props) => <ApplicantProfile jobid={props.match.params.jobid} userid={props.match.params.userid}/>} />
        </Switch>
      </div> 
    </Router>
    </div>
  )

  return (
    <div className="App">
      {routing}
    </div>
  );
}

export default App;
