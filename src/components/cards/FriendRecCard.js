import React, {useState} from 'react';
import { Grid, Box, Avatar, IconButton, Link, ButtonBase } from '@mui/material';
import { styled } from "@mui/material/styles";
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const BASE_URL = process.env.REACT_APP_URL

export default function FriendRecCard({ nickname, photo, onAddFriend, sent, index }) {
    const StyledAccount = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2, 2.5),
        width: '100%',
    }));

    const [isSent, setIsSent] = useState(sent);
    const navigate = useNavigate();

    const handleAdd = async () => {
        try {
            await onAddFriend(nickname, index);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRecClick = (username) => {
        navigate(`/profile/${username}`, {replace: true});
    }

    return (
        <StyledAccount>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Avatar src={photo} alt="photoURL" sx={{ width: 40, height: 40 }} />
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ overflow: 'hidden' }}>
                        <ButtonBase onClick={() => handleRecClick(nickname)}>
                            <Box sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 100, mt: 1 }}>
                                {nickname}
                            </Box>
                        </ButtonBase>
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {!isSent ? (<IconButton size="small" onClick={handleAdd}>
                            <AddIcon />
                        </IconButton>) : (
                            <IconButton size="small">
                                <DoneIcon />
                            </IconButton>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </StyledAccount>
    )
}
