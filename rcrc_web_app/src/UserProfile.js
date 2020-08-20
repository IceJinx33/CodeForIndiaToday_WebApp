import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import './UserProfile.css'

export default function User({ id , setSign }) {

  const proxyurl = "https://secret-brushlands-43215.herokuapp.com/";
  const endpt = 'https://for-india-today-poc-backend.herokuapp.com';

  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [dispDropDown, setDropDown] = useState(true);

  const history = useHistory();

  function goToSign () {
    sessionStorage.removeItem("user-userID");
    setSign(null);
    history.push("/");
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetch(proxyurl + endpt + '/users/get?id='+id, {signal: signal})
      .then(res => res.ok ? res.json() : 
      alert('Your profile details could not be retrieved at this time. \nPlease refresh the page and try again.'))
      .then(json => setUser(json["data"]))
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

  function openForm() {
    document.getElementById("ud-myForm").style.display = "block"
    document.getElementById("userButtonRow").style.opacity = "0.3"
    document.getElementById("userDisp").style.opacity = "0.3"
    setName(user.name)
    setContact(user.contact)
  }
  function closeForm() {
    document.getElementById("ud-myForm").style.display = "none"
    document.getElementById("userButtonRow").style.opacity = "1"
    document.getElementById("userDisp").style.opacity = "1"
  }

  function deleteUser () {
    var formData = new FormData();
    formData.append('id', id);

    fetch(proxyurl + endpt + '/users/remove', {
      method: 'POST',
      body: formData
    })
      .then(res => { 
        if (res.ok) {
          alert('Your account was deleted.');
          goToSign();
        } 
        else {
          alert("Your account could not be deleted at this time. \nPlease try again.");
        }
      })
      .catch(err => console.log(err))
  }

  const updateUser = () => {
    var formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('contact', contact);
  
    fetch(proxyurl + endpt + '/users/update', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          alert("User profile could not be updated at this time. \nPlease try again.");
          throw new Error("Update User Error");
        }
        else {
          res.text()
        }
      })
      .then(j => setUser({ id, name, contact }))
      .catch(err => console.log(err))
      .finally(() => closeForm());
  }

  return (
    user === "" || user === undefined ? 
    (user === undefined ? <div className="noUser">User not Found</div> : <div></div>) : 
    <div>
      <div className="ud-form-popup" id="ud-myForm">
      <div className="ud-form-container">
        <div className="ud-formHeading">
            <h2>Update User Profile</h2>
        </div>
        <label className="ud-enterUserName">User Name</label>
        <input type="text" value={name} onChange={e => setName(e.currentTarget.value)} placeholder={user.name} required />

        <label className="ud-enterUserContact">User Contact</label>
        <input type="text" value={contact} onChange={e => setContact(e.currentTarget.value)} placeholder={user.contact} required />

        <button type="submit" className="ud-submitButton" onClick={updateUser}>Submit</button>
        <button type="button" className="ud-cancelButton" onClick={closeForm}>Cancel</button>
      </div>
    </div> 

    <div className="userButtonRow" id="userButtonRow">
      <div className="u-dropdownMenu">
        <button className="u-dropButton" onClick={showDropDown}>
          <img className="u-dropImage" src={require('./menu.png')} alt="menu" />
          Menu
        </button>
      </div>
      <div className="u-dropdownContent" id="dropdownContent">
          <div className="u-dropList">
            <button className="u-dropLink" onClick={openForm}>Edit User Profile</button>
            <button className="u-dropLink" onClick={goToSign}>Log Out</button>
            <button className="u-dropLink" onClick={deleteUser}>Delete Account</button>
          </div>
     </div>
    </div>

    <div className="user" id="userDisp">
      <div className="userNamePic"> 
        <div className="userPic">
          <img className="userImage" src={require('./person.png')} alt="person" />
        </div>
        <div className = "userName">
          <label className="userNameVal">{user.name}</label>
        </div>
      </div>
      <div className="userInfo">
        <div className="userID">
          <label className="userIDTitle">User ID</label>
          <label className="userIDVal">{user.id}</label>
        </div>
        <div className="userContact">
          <label className="userContactTitle">Contact</label>
          <label className="userContactVal">{user.contact}</label>
        </div>
      </div>
    </div> 
    </div>
  );

}