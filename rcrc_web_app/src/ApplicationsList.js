import React, { useState, useEffect } from 'react';
import Application from './ApplicationContainer.js'
import './ApplicationsList.css';

export default function AppLister({jobid}) {

  const proxyurl = "https://secret-brushlands-43215.herokuapp.com/";
  const endpt = 'https://for-india-today-poc-backend.herokuapp.com';

  const [applications, setApps] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(proxyurl + endpt + '/applications/list?job='+jobid, {signal: signal})
      .then(res => res.ok ? res.json() : 
      alert('Job applications could not be retrieved at this time. \nPlease refresh the page and try again.'))
      .then(json => setApps(json["data"]))
      .catch(err => console.log(err));

    return function cleanup() {
      abortController.abort();
    }
  }, [jobid]);

  return (
    <div className="appsBody">
      <label className="appsListTitle">Applicants</label>
      {applications !== undefined ? <div className="appsList" id="appsList">
        {applications.map((a) => (
          <Application key={a.job+a.user} {...a} />
        ))}
      </div> : 
      <div className="noApplications">No Applicants</div>}
    </div>
  );
}