import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './JobDisplay.css';

export default function JobDisplay({ id }) {

  const proxyurl = "https://secret-brushlands-43215.herokuapp.com/";
  const endpt = 'https://for-india-today-poc-backend.herokuapp.com';

  const [job, setJob] = useState("");
  const [dispDropDown, setDropDown] = useState(true);
  const [name, setName] = useState("")
  const [status, setStatus] = useState("")
  const [description, setDesc] = useState("")

  const history = useHistory();

  function goToSearchJobs () {
    history.push("/list-jobs");
  }

  function goToSeeApps () {
    history.push("/list-apps/"+id);
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetch(proxyurl + endpt + '/jobs/get?id='+id, {signal: signal})
      .then(res => res.ok ? res.json() : 
      alert('Job details could not be retrieved at this time. \nPlease refresh the page and try again.'))
      .then(json => setJob(json["data"]))
      .catch(err => console.log(err));

    return function cleanup() {
      abortController.abort();
    }
  }, [id]);

  function showDropDown () {
    setDropDown(!dispDropDown);
    dispDropDown ? document.getElementById("dropdownContent").style.display = "inline-block"
    : document.getElementById("dropdownContent").style.display = "none"
  }

  function deleteJob () {
    var formData = new FormData();
    formData.append('id', id);

    fetch(proxyurl + endpt + '/jobs/remove', {
      method: 'POST',
      body: formData
    })
      .then(res => { 
        if (res.ok) {
          alert('Job was deleted.');
          goToSearchJobs();
        } 
        else {
          alert("Job could not be deleted at this time. \nPlease try again.");
        }
      })
      .catch(err => console.log(err))
  }

  const updateJobName = (event) => {
    const jobName = event.currentTarget.value;
    setName(jobName);
  };

  const updateJobDesc = (event) => {
    const jobDesc = event.currentTarget.value;
    setDesc(jobDesc);
  };

  const updateJobStatus = (event) => {
    const jobStat = event.currentTarget.value;
    setStatus(jobStat);
  };

  function openForm() {
    document.getElementById("jd-myForm").style.display = "block"
    document.getElementById("jobButtonRow").style.opacity = "0.3"
    document.getElementById("jobDisplay").style.opacity = "0.3"
    document.getElementById("jobDispDescBody").style.opacity = "0.3"
    setName(job.name)
    setStatus(job.status)
    setDesc(job.description)
  }
  function closeForm() {
    document.getElementById("jd-myForm").style.display = "none"
    document.getElementById("jobButtonRow").style.opacity = "1"
    document.getElementById("jobDisplay").style.opacity = "1"
    document.getElementById("jobDispDescBody").style.opacity = "1"
  }

  const updateJob = () => {
    var formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('status', status);
  
    fetch(proxyurl + endpt + '/jobs/update', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          alert("Job could not be updated at this time. \nPlease try again.");
          throw new Error("Update Job Error");
        }
        else {
          res.text()
        }
      })
      .then(j => setJob({ id, name, description, status }))
      .catch(err => console.log(err))
      .finally(() => closeForm());
  }

  return (
 job === "" || job === undefined ? 
 (job === undefined ? <div className="noJob">Job not Found</div> : <div></div>)  :
 <div className="jobsPage">
    <div className="jd-form-popup" id="jd-myForm">
      <div className="jd-form-container">
        <div className="jd-formHeading">
            <h2>Update Job Details</h2>
        </div>
        <label className="jd-enterJobName">Job Name</label>
        <input type="text" value={name} onChange={updateJobName} placeholder={job.name} required />

        <label className="jd-enterJobStatus">Job Status</label>
        <input type="text" value={status} onChange={updateJobStatus} placeholder={job.status} required />

        <label className="jd-enterJobDesc">Job Description</label>
        <input type="text" value={description} onChange={updateJobDesc} placeholder={job.description} required />

        <button type="submit" className="jd-submitButton" onClick={updateJob}>Submit</button>
        <button type="button" className="jd-cancelButton" onClick={closeForm}>Cancel</button>
      </div>
    </div>  

    <div className="jobButtonRow" id="jobButtonRow">
      <div className="dropdownMenu">
        <button className="dropButton" onClick={showDropDown}>
          <img className="dropImage" src={require('./menu.png')} alt="menu" />
          Menu
        </button>
      </div>
      <div className="dropdownContent" id="dropdownContent">
          <div className="dropList">
            <button className="dropLink" onClick={goToSeeApps}>See Applicants</button>
            <button className="dropLink" onClick={openForm}>Edit Job Details</button>
            <button className="dropLink" onClick={deleteJob}>Delete Job</button>
          </div>
     </div>
    </div>

    <div className="jobDisplay" id="jobDisplay">
      <div className="jobDispDetails">
        <div className="jobDisplayImage">
          <img className="jobDisplayimage" src={require('./suitcase.png')} alt="suitcase" />
        </div>
        <div className="jobDispInfo">
          <label className="jobDispName">{job.name}</label>
          <label className="jobDispStatus">{job.status}</label>
          <label className="jobDispID">Job ID : {job.id}</label>
        </div>
    </div>
    <div className="jobDispDescBody" id="jobDispDescBody">
      <label className="jobDispDesc">{job.description}</label>
    </div>
  </div> 
</div> 
); 
}