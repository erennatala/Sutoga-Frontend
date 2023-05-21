import React from 'react';
import {Grid, Box, Avatar, IconButton, Link, ButtonBase, Typography} from '@mui/material';
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    width: '100%',
}));

const BASE_URL = process.env.REACT_APP_URL

export default function ProfileCardSm({ username, profilePhotoUrl, isFriend }) {

    const handleAdd = () => {

    }

    return(
        <StyledAccount>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Avatar src={profilePhotoUrl} alt="photoURL" sx={{ width: 50, height: 50 }} /> {/* Adjust Avatar size here */}
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ overflow: 'hidden' }}>
                        <ButtonBase>
                            <Link underline="none" sx={{color: "black"}}>
                                <Typography variant="h6" component="div" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 200, mt: 1 }}> {/* Adjust nickname font size here */}
                                    {username}
                                </Typography>
                            </Link>
                        </ButtonBase>
                    </Box>
                </Grid>
                {!isFriend && <Grid item xs={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton size="small" onClick={handleAdd}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Grid>}
            </Grid>
        </StyledAccount>
    )
}