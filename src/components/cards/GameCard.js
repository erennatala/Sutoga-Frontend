import { styled } from "@mui/material/styles";
import { Box, Card, Container, Grid, Typography } from "@mui/material";
import React from "react";

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
        width: '100%', // Yüzde cinsinden genişlik
        height: 270,
    },
}));

export default function GameCard({ game, onClick }) {
    return (
        <Container onClick={onClick} sx={{ cursor: 'pointer', py: 2 }}>
            <StyledCard>
                <Grid container direction="column" spacing={1} style={{ height: '100%', alignItems: 'stretch' }}>
                    <Grid item style={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Box
                            component="img"
                            sx={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover',
                                display: 'block',
                            }}
                            alt={game.gameTitle}
                            src={game.gamePhotoUrl}
                        />
                    </Grid>

                    <Grid item>
                        <Box pl={1} pr={1}>
                            <Typography variant="h6" noWrap>{game.gameTitle}</Typography>
                        </Box>
                    </Grid>

                    <Grid item>
                        <Box pl={1} pr={1}>
                            <Typography variant="body2" noWrap>{game.publisher}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </StyledCard>
        </Container>
    );
}
