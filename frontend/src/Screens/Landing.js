import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

function LandingPage() {
  const navigate = useNavigate();

  function logout() {
    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/sign_out`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.location.reload();
      });
  }

  return (
    <div className="container">
      <h1 className="title">DEMOQUEUE.</h1>
        <p style={{color: 'orange'}}>IN DEVELOPMENT, CONTACT ROBERT SHEIMAN FOR CREATE ACCOUNT ACCESS.</p>

      <form
        className="queueForm"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(e);
        }}
      >
        <input type="text" id="event_code_input" placeholder="Event Code" />
        <button
          className="landingPage__button"
          type="submit"
          onClick={() =>
            navigate(
              "Demoqueue/queue?event_name=" +
                document.getElementById("event_code_input").value
            )
          }
        >
          Join Queue
        </button>
      </form>
      <br />
      <h3> OR </h3>
      <br />
      <button
        className="landingPage__button"
        onClick={() => navigate("/authenticate")}
      >
        Create Queue
      </button>
      <button
        className="landingPage__button"
        onClick={() => navigate("/queue?event_name=DEMO")}
      >
        SEE DEMO
      </button>
      <br />
    </div>
  );
}

export default LandingPage;
