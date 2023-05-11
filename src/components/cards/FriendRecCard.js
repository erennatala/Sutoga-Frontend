import React, {useState} from 'react';
import { Grid, Box, Avatar, IconButton, Link, ButtonBase } from '@mui/material';
import { styled } from "@mui/material/styles";
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import axios from "axios";

const BASE_URL = process.env.REACT_APP_URL

export default function FriendRecCard({ nickname }) {
    const StyledAccount = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2, 2.5),
        width: '100%',
    }));

    const [isSent, setIsSent] = useState(false);

    const handleAdd = async () => {
        try {
            const id = await window.electron.ipcRenderer.invoke('getId');
            const token = await window.electron.ipcRenderer.invoke('getToken');

            const formData = new FormData();
            formData.append('senderId', id);
            formData.append('receiverUsername', nickname);

            //const response = await axios.post( `${BASE_URL}users/sendFriendRequest?senderId=${id}&receiverUsername=${nickname}`
            const response = await axios.post( `${BASE_URL}users/sendFriendRequest`, formData, {
                headers: {
                    'Authorization': `${token}`
                }
            });

            setIsSent(response)
        } catch (err) {

        }
    }

    return (
        <StyledAccount>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Avatar src="" alt="photoURL" sx={{ width: 40, height: 40 }} />
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ overflow: 'hidden' }}>
                        <ButtonBase>
                            <Link underline="none" sx={{color: "black", fontWeight: "bold"}}>
                                <Box sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 100, mt: 1 }}>
                                    {nickname}
                                </Box>
                            </Link>
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
