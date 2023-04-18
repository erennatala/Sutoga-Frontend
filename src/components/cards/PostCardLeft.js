import {Avatar, Box, ButtonBase, Card, Container, Grid, Link, Stack, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import React from "react";



const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2),
}));

export default function PostCardLeft(props) {

    return(
        <Container sx={{ml: 2}}>
            <Card>
                <Grid item container direction={"column"}>
                    <Grid item>
                        <Box>
                            <ButtonBase>
                                <Link underline="none">
                                    <StyledAccount>
                                        <Avatar src="" alt="photoURL" />

                                        <Grid>
                                            <Box sx={{ ml: 2}} onClick={(e) => console.log(e)}>
                                                <Stack direction={"row"}>
                                                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                                        keremmican
                                                    </Typography>

                                                    <Typography>
                                                        &nbsp;
                                                    </Typography>

                                                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                                        •
                                                    </Typography>

                                                    <Typography>
                                                        &nbsp;
                                                    </Typography>

                                                    <Grid sx={{mt:0.5}}>
                                                        <Typography variant="subtitle3" sx={{ color: 'text.primary' }}>
                                                            friend
                                                        </Typography>
                                                    </Grid>
                                                </Stack>
                                            </Box>
                                        </Grid>
                                    </StyledAccount>
                                </Link>
                            </ButtonBase>
                        </Box>
                    </Grid>

                    <Grid item style={{height: '%100'}}>
                        <Box
                            component="img"
                            // sx={{
                            //     height: 233,
                            //     width: 350,
                            //     maxHeight: { xs: 233, md: 167 },
                            //     maxWidth: { xs: 350, md: 250 },
                            // }}
                            sx={{ml: 2,
                                mb: 2,
                                borderRadius: 2,
                                maxHeight: { xs: 233, md: 340 }
                            }}
                            alt="x"
                            src= {props.img}
                        />
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
}