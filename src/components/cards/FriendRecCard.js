import React from 'react';
import { Grid, Box, Avatar, IconButton, Link, ButtonBase } from '@mui/material';
import { styled } from "@mui/material/styles";
import AddIcon from '@mui/icons-material/Add';

export default function FriendRecCard({ nickname }) {
    const StyledAccount = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2, 2.5),
        width: '100%',
    }));

    const handleAdd = () => {
        // Handle the Add action here
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
                        <IconButton size="small" onClick={handleAdd}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </StyledAccount>
    )
}
