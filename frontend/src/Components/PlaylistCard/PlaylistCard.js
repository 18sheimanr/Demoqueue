import React, {useEffect, useState} from "react";
import ToggleButton from '@mui/material/ToggleButton';
import CheckIcon from "@mui/icons-material/Check";
import "./PlaylistCard.css";

function PlaylistCard(props){

    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if(!props.selected){
            setSelected(false);
        }
    }, [props.selected])

    return (
        <div className="playlistCard__container">
            <img
                className="playlistCard__image"
                src={props.playlistArtURL}
                alt={props.name}
            />
            <h2 className="playlistCard__title">
                {props.name}
            </h2>
            <ToggleButton
                value="check"
                color="standard"
                selected={selected}
                onChange={() => {
                    if(selected){
                        setSelected(false);
                        props.onSelect("");
                    }else{
                        props.onSelect(props.playlistId);
                        setSelected(true);
                    }
                }}
            >
                <CheckIcon style={{ color: 'white' }} />
            </ToggleButton>
        </div>
    );

}

export default PlaylistCard;