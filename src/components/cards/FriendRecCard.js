import React, {useState} from "react";
import {Grid, Container, Typography, Card, CardHeader, Box, Avatar, Button, Link} from '@mui/material';
import {alpha, styled} from "@mui/material/styles";

export default function FriendRecCard(props) {

    const [photoPath, setPhotoPath] = useState("");

    const StyledAccount = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2, 2.5),
        borderRadius: Number(theme.shape.borderRadius) * 1.5,
        backgroundColor: alpha(theme.palette.grey[500], 0.12),
    }));

    return(
        <>
            <Container sx={{position: "fixed", mt: 2}}>
                <Grid item xs={4}>
                    <Box>
                        <Link underline="none">
                            <StyledAccount>
                                <Avatar src="" alt="photoURL" />

                                <Box sx={{ ml: 2, width: "50%" }}>
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
                    <Button variant="text">See more like this</Button>
                </Grid>
            </Container>
        </>
    )
}