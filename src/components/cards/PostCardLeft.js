import {Avatar, Box, ButtonBase, Card, Container, Grid, Link, Stack, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import React from "react";
import {useNavigate} from "react-router-dom";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2),
}));

export default function PostCardLeft(props) {
    const navigate = useNavigate();

    const handlePostClick = () => {
        navigate(`/post/${props.postId}`);
    };

    return(
        <Container sx={{ml: 2}}>
            <Card onClick={handlePostClick}>
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
                                                    <Link underline="none" onClick={(e) => console.log(e)}>
                                                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                                            {props.username}
                                                        </Typography>
                                                    </Link>

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
                        {props.img ? (
                            <Box
                                component="img"
                                sx={{
                                    ml: 2,
                                    mb: 2,
                                    borderRadius: 2,
                                    width: '96%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                alt="x"
                                src={props.img}
                            />) : (
                            <Typography variant={props.img ? "subtitle2" : "h6"} sx={{ color: 'text.primary', ml: 2, mb:2 }}>
                                selamun aleyküm gençler
                            </Typography>
                        )
                        }
                    </Grid>

                    <Grid item>
                        <Typography sx={{ color: 'text.primary', ml: 2, mb:2, fontSize: 14 }} variant="subtitle1">
                            20.31.10 17:30
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
}