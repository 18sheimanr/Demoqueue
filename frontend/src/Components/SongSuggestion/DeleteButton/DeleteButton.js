import { IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React from "react";

function DeleteButton(props) {
  return (
    <>
      {props.isAdmin ? (
        <IconButton
          onClick={() => {
            props.deleteSuggestion(props.index);
          }}
        >
          <Delete />
        </IconButton>
      ) : null}
    </>
  );
}

export default DeleteButton;
