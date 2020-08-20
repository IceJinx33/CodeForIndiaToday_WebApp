import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Job from './JobContainer.js'
import './JobsList.css';

export default function JobLister(props) {

  const proxyurl = "https://secret-brushlands-43215.herokuapp.com/";
  const endpt = 'https://for-india-today-poc-backend.herokuapp.com';

  const [jobs, setJobs] = useState([]);
  const [searchField, setSearchField] = useState("")
  const [name, setName] = useState("")
  const [description, setDesc] = useState("")

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(proxyurl + endpt + '/jobs/list/ngo', {signal: signal})
      .then(res => res.ok ? res.json() : 
      alert('Jobs could not be retrieved at this time. \nPlease refresh the page and try again.'))
      .then(json => setJobs(json["data"]))
      .catch(err => console.log(err));

    return function cleanup() {
      abortController.abort();
    }
  }, []);

  function openForm() {
    document.getElementById("myForm").style.display = "block"
    document.getElementById("buttonRow").style.opacity = "0.3"
    document.getElementById("jobsList").style.opacity = "0.3"
  }
  function closeForm() {
    document.getElementById("myForm").style.display = "none"
    document.getElementById("buttonRow").style.opacity = "1"
    document.getElementById("jobsList").style.opacity = "1"
  }

  const updateSearchField = (event) => {
    const searchText = event.currentTarget.value;
    setSearchField(searchText);
  };

  const updateJobName = (event) => {
    const jobName = event.currentTarget.value;
    setName(jobName);
  };

  const updateJobDesc = (event) => {
    const jobDesc = event.currentTarget.value;
    setDesc(jobDesc);
  };

  const createJob = () => {
    if (name === "" || description === "") {
      alert('Please fill in all the fields of the form.');
    }
    else {
      var formData = new FormData();
      var id = uuidv4();
      var status = 'Available';
      formData.append('id', id);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('status', status);

      fetch(proxyurl + endpt + '/jobs/add', {
        method: 'POST',
        body: formData
      })
        .then(res => {
          if (!res.ok) {
            alert("Job could not be created at this time. \nPlease try again.");
            throw new Error("Create Job Error");
          }
          else {
            res.text()
          }
        })
        .then(j => setJobs([...jobs, { id, name, description, status }]))
        .catch(err => console.log(err))
        .finally(() => closeForm());
      }
  }

  return (
    jobs !== undefined ?
    <div className="jobsBody">
      <div className="form-popup" id="myForm">
        <div className="form-container">
          <div className="formHeading">
            <h2>Create Job</h2>
          </div>
          <label className="enterJobName">Job Name</label>
          <input type="text" value={name} onChange={updateJobName} placeholder="Enter Job Name" required />

          <label className="enterJobDesc">Job Description</label>
          <input type="text" value={description} onChange={updateJobDesc} placeholder="Enter Job Description" required />

          <button type="submit" className="submitButton" onClick={createJob}>Submit</button>
          <button type="button" className="cancelButton" onClick={closeForm}>Cancel</button>
        </div>
      </div>
      <div className="myButtonRow" id="buttonRow">
        <div className="jobSearchBar">
          <input type="text" className="jobSearch" value={searchField}
            onChange={updateSearchField} placeholder="Search" />
          <input type="button" className="searchButton" />
        </div>
        <button className="addButton" onClick={openForm}>Add a Job</button>
      </div>
      <div className="jobsList" id="jobsList">
        {jobs.map((j) => (
          <Job key={j.id} {...j} />
        ))}
      </div>
    </div> : <div className="noJobs">No Jobs Available</div>
  );
}