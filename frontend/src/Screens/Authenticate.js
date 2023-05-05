import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Authenticate.css";
import LiveQueue from "./LiveQueue";

function Authenticate() {
  const navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [signupUsernameInput, setSignupUsernameInput] = useState("");
  const [signupPasswordInput, setSignupPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    fetch("https://demoqueue-server.herokuapp.com/login", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.authenticated) {
          data.spotifyAuthorized
            ? navigate("/create_event")
            : window.location.replace(data.spotifyAuthLink);
        }
      });
  }, []);

  function onSignup(event) {
    event.preventDefault();
    if (confirmPasswordInput !== signupPasswordInput) {
      alert("Passwords do not match");
      return;
    }
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: signupUsernameInput,
        password: signupPasswordInput,
      }),
    };
    fetch("https://demoqueue-server.herokuapp.com/sign_up", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.authenticated) {
          window.location.reload();
        }
      });
  }

  function onLogin(event) {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
      }),
    };
    fetch("https://demoqueue-server.herokuapp.com/login", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.location.reload();
      });
  }

  let signUpForm = (
    <form className="auth_form" onSubmit={(event) => onSignup(event)}>
      <input
        type="text"
        placeholder="Username"
        value={signupUsernameInput}
        onChange={(event) => setSignupUsernameInput(event.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={signupPasswordInput}
        onChange={(event) => setSignupPasswordInput(event.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPasswordInput}
        onChange={(event) => setConfirmPasswordInput(event.target.value)}
      />
      <button className="landingPage__button" type="submit">
        Sign Up
      </button>
    </form>
  );

  let loginForm = (
    <form className="auth_form" onSubmit={(event) => onLogin(event)}>
      <input
        type="text"
        placeholder="Username"
        value={usernameInput}
        onChange={(event) => setUsernameInput(event.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={passwordInput}
        onChange={(event) => setPasswordInput(event.target.value)}
      />
      <button className="landingPage__button" type="submit">
        Log In
      </button>
    </form>
  );

  return (
    <div className="container">
      <h1 className="title">SIGN UP AS AN EVENT HOST.</h1>
      {signUpForm}
      <br />
      <h2>OR</h2>
      <h1 className="title">LOG IN.</h1>
      {loginForm}
    </div>
  );
}

export default Authenticate;
