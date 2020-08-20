import React from 'react'
import './JobContainer.css'
import { useHistory } from "react-router-dom";

export default function Job({ id, name, description, status }) {

  const history = useHistory();

  function goToJobDisplay () {
    history.push("/job-details/"+id);
  }

  return (
    <div className="job" onClick={goToJobDisplay}>
      <div className="jobImage">
        <img className="jobimage" src={require('./suitcase.png')} alt="suitcase" />
      </div>
      <div className="jobInfo">
        <label className="jobName">{name}</label>
        <label className="jobStatus">{status}</label>
        <label className="jobDesc">{description}</label>
      </div>
    </div>
  );

}