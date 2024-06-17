import React from "react";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from 'react';
import "./SessionCode.css"

function SessionCode(props) {
  const [size] = useState(400);
  const [qrCode, setQrCode] = useState("");
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let event_name = params.get('event_name');
  const baseURL = "http://localhost:3000"

  useEffect(() => {
      const eventURL = baseURL + event_name
    setQrCode
 (`http://api.qrserver.com/v1/create-qr-code/?data=${eventURL}!&size=${size}x${size}`);
  }, [size]);

  const navigate = useNavigate();
  return (
    <div className='main'>
      <h1>Current Session Code</h1>
      <button onClick={() => navigate("/queue?event_name="+event_name)}>Back</button>
      <div className="output-box">
        <img src={qrCode} alt="" />
        <a href={qrCode} download="QRCode">
          <button type="button" className='download-button'>Download</button>
        </a>
      </div>
    </div>
  );
}

export default SessionCode;
