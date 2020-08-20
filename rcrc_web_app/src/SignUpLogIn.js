import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import './SignUpLogIn.css';

export default function SignUpLogIn (props) {

  const history = useHistory();

  const proxyurl = "https://secret-brushlands-43215.herokuapp.com/";
  const endpt = 'https://for-india-today-poc-backend.herokuapp.com';

  const [signUp, setSignUp] = useState(true)
  const [userid, setID] = useState("");
  const [username, setName] = useState("");
  const [usercontact, setContact] = useState("");

  function goToUserProfile () {
    if (userid !== "") {
      sessionStorage.setItem("user-userID", userid);
      props.setSign(userid);
      history.push("/user-profile/"+userid) 
    } 
    else {
      alert('Please enter your user ID.');
    }  
  }

  const createUser = () => {
    if (userid === "" || username === "" || usercontact === "") {
      alert('Please fill in all the fields of the form.');
    }
    else {
      var formData = new FormData();

      formData.append('id', userid);
      formData.append('name', username);
      formData.append('contact', usercontact);
    
      fetch(proxyurl + endpt + '/users/add', {
        method: 'POST',
        body: formData
      })
        .then(res => {
          if (!res.ok) {
            alert("Sign Up failed. \nPlease try again.");
            throw new Error("Create User Error");
          }
          else {
            res.text()
          }
        })
        .then(j => {
          sessionStorage.setItem("user-userID", userid);
          goToUserProfile();
        })
        .catch(err => console.log(err))
    }
  }


  return (
  <div>
   { signUp ? 

      <div className="s-form-popup" id="s-myForm">
        <div className="s-form-container">
          <div className="s-formHeading">
              <h2>Sign Up</h2>
          </div>
          <label className="enterUserID">User ID</label>
          <input type="text" value={userid} onChange={e => setID(e.currentTarget.value)} placeholder="Enter User ID" required />

          <label className="enterUserName">User Name</label>
          <input type="text" value={username} onChange={e => setName(e.currentTarget.value)} placeholder="Enter Name" required />

          <label className="enterUserContact">Phone Number</label>
          <input type="text" value={usercontact} onChange={e => setContact(e.currentTarget.value)} placeholder="Enter Phone Number" required />

          <button type="submit" className="s-submitButton" onClick={createUser}>Sign Up</button>
          <label className="orLabel">or</label>
          <button type="button" className="s-logIn" onClick={e => setSignUp(false)}>Login</button>

        </div>
      </div>

    : 
     
      <div className="s-form-popup" id="s-myForm">
          <div className="s-form-container">
            <div className="s-formHeading">
                <h2>Log In</h2>
            </div>
            <label className="enterUserID">User ID</label>
            <input type="text" value={userid} onChange={e => setID(e.currentTarget.value)} placeholder="Enter User ID" required />

            <button type="submit" className="s-submitButton" onClick={goToUserProfile}>Log In</button>
            <label className="orLabel">or</label>
            <button type="button" className="s-logIn" onClick={e => setSignUp(true)}>Sign Up</button>

          </div>
        </div>
    
    }
    </div>
  
  );
}