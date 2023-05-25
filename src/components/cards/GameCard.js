import { styled } from "@mui/material/styles";
import { Box, Card, Container, Grid, Typography } from "@mui/material";
import React from "react";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
}));

export default function GameCard({ game, onClick }) {
    return (
        <Container onClick={onClick} sx={{ cursor: 'pointer', py: 2 }}>
            <Card sx={{ width: 400, height: 270, display: 'flex', flexDirection: 'column' }}>
                <Grid container direction="column" style={{ height: '100%' }}>
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
            </Card>
        </Container>
    );
}
