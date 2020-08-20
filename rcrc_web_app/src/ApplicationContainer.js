import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './ApplicationContainer.css';

export default function Application({ job, user, status }) {

  const proxyurl = "https://secret-brushlands-43215.herokuapp.com/";
  const endpt = 'https://for-india-today-poc-backend.herokuapp.com';

  const history = useHistory();

  const [userProfile, setUser] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetch(proxyurl + endpt + '/users/get?id='+user, {signal: signal})
      .then(res => res.ok ? res.json() : 
      alert('User details could not be retrieved at this time. \nPlease refresh the page and try again.'))
      .then(json => setUser(json["data"]))
      .catch(err => console.log(err));

    return function cleanup() {
      abortController.abort();
    }
  }, [job, user, status]);

  function goToUserProfile () {
    history.push("/applicant-profile/"+job+'/'+user);
  }

  return (
    <div className="application" onClick={goToUserProfile}>
      <div className="appImage">
        <img className="appimage" src={require('./person.png')} alt="person" />
      </div>
      <div className="appInfo">
        <label className="appUserName">{userProfile.name}</label>
        <label className="appStatus">{status}</label>
      </div>
    </div>
  );

}