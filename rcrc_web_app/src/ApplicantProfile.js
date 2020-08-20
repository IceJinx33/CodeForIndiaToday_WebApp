import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import './ApplicantProfile.css'

export default function ApplicantProfile({ jobid , userid }) {

  const proxyurl = "https://secret-brushlands-43215.herokuapp.com/";
  const endpt = 'https://for-india-today-poc-backend.herokuapp.com';

  const [user, setUser] = useState("");

  const history = useHistory();

  function goToAppsDisplay () {
    history.push("/list-apps/"+jobid);
  }

  function updateApplication (statusValue) {
    var formData = new FormData();
    formData.append('job', jobid);
    formData.append('user', userid);
    formData.append('status', statusValue);
  
    fetch(proxyurl + endpt + '/applications/update', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          alert("Application could not be updated at this time. \nPlease try again.");
          throw new Error("Update Application Error");
        }
        else {
          res.text();
          alert("Applicant has been "+statusValue.toLowerCase() +".");
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        goToAppsDisplay();
      })
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetch(proxyurl + endpt + '/users/get?id='+userid, {signal: signal})
      .then(res => res.ok ? res.json() : 
      alert('User details could not be retrieved at this time. \nPlease refresh the page and try again.'))
      .then(json => setUser(json["data"]))
      .catch(err => console.log(err));

    return function cleanup() {
      abortController.abort();
    }
  }, [jobid, userid]);

  return (
    user === "" || user === undefined ? 
    (user === undefined ? <div className="noAppUser">User not Found</div> : <div></div>) 
    :
    <div>
      <div className="app-user">
        <div className="app-userNamePic"> 
          <div className="app-userPic">
            <img className="app-userImage" src={require('./person.png')} alt="person" />
          </div>
          <div className = "app-userName">
            <label className="app-userNameVal">{user.name}</label>
          </div>
        </div>
        <div className="app-userInfo">
          <div className="app-userID">
            <label className="app-userIDTitle">User ID</label>
            <label className="app-userIDVal">{user.id}</label>
          </div>
          <div className="app-userContact">
            <label className="app-userContactTitle">Contact</label>
            <label className="app-userContactVal">{user.contact}</label>
          </div>
        </div>
      </div>
      <div className="accRejButtons">
        <button className="acceptButton" value = "Accepted" onClick={e => updateApplication(e.target.value)}>Accept</button>
        <button className="rejectButton" value = "Rejected" onClick={e => updateApplication(e.target.value)}>Reject</button>
      </div>
    </div>
  );

}