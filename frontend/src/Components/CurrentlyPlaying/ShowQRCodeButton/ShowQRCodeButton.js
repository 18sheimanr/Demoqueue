import { IconButton } from "@material-ui/core";
import React from "react";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { useNavigate } from "react-router-dom";

function ShowQRCodeButton(props) {
  const navigate = useNavigate();
  return (
    <IconButton
      style={{
        marginRight: "1rem",
        color: "#4CAF50",
        transform: "scale(1.2)",
      }}
      onClick={() => navigate("/code?event_name="+props.eventName)}
    >
      <QrCodeIcon />
    </IconButton>
  );
}

export default ShowQRCodeButton;
