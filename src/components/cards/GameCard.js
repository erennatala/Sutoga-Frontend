import { styled } from "@mui/material/styles";
import { Box, Card, Container, Grid, Typography } from "@mui/material";
import React from "react";

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative', // Adding relative positioning to the card
    [theme.breakpoints.up('sm')]: {
        width: '100%', // Yüzde cinsinden genişlik
        height: 270,
    },
}));

export default function GameCard({ game, onClick, index }) {
    return (
        <Container onClick={onClick} sx={{ cursor: 'pointer', py: 2 }}>
            <StyledCard>
                <Grid container direction="column" spacing={1} style={{ height: '100%', alignItems: 'stretch' }}>
                    <Grid item style={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
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
                        <Typography variant="body1" sx={{ ml: 1.5, position: 'absolute', bottom: 0, left: 0, color: 'white', background: 'rgba(0, 0, 0, 0.5)', p: 1 }}>{index}</Typography>
                        {/*<Typography variant="body1" sx={{ position: 'absolute', bottom: 0, right: 0, color: 'white', background: 'rgba(0, 0, 0, 0.5)', p: 1 }}>Right Text</Typography>*/}
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
