import React, {useState} from "react";
import {Grid, Container, Typography, Card, CardHeader, Box, Avatar, Button, Link} from '@mui/material';
import {alpha, styled} from "@mui/material/styles";

export default function FriendRecCard(props) {

    const [photoPath, setPhotoPath] = useState("");

    const StyledAccount = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2, 2.5),
    }));

    return(
        <>

                <Grid>
                    <Box>
                        <Link underline="none">
                            <StyledAccount>
                                <Avatar src="" alt="photoURL" />

                                <Box sx={{ ml: 2}}>
                                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                        keremmican
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        rookie
                                    </Typography>
                                </Box>

                                <Box sx={{ ml: 2 }}>
                                    <Button> + Add Friend</Button>
                                </Box>
                            </StyledAccount>
                        </Link>
                    </Box>
                </Grid>
        </>
    )
}