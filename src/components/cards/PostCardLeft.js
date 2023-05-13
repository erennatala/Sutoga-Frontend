import {Avatar, Box, ButtonBase, Card, Container, Divider, Grid, Link, Stack, Typography} from "@mui/material";
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
        navigate(`/post/${props.post.id}`);
    };

    return(
        <Container sx={{ml: 2, pt:1, pb: 2}} spacing={2}>
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
                                                            {props.post.username}
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
                                                </Stack>
                                            </Box>
                                        </Grid>
                                    </StyledAccount>
                                </Link>
                            </ButtonBase>
                        </Box>
                    </Grid>

                    <Grid item style={{ height: '100%' }}>
                        {props.post.mediaUrl ? (
                            <Box>
                                <Box sx={{ ml: 3, mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                        {props.post.description}
                                    </Typography>
                                </Box>
                                <Box>
                                    {props.post.mediaUrl.endsWith('.mp4') ||
                                    props.post.mediaUrl.endsWith('.mov') ||
                                    props.post.mediaUrl.endsWith('.avi') ? (
                                        <video
                                            style={{
                                                marginLeft: '2px',
                                                marginBottom: '2px',
                                                borderRadius: '2px',
                                                width: '100%',
                                                height: 'auto',
                                                objectFit: 'cover',
                                            }}
                                            controls
                                        >
                                            <source src={props.post.mediaUrl} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img
                                            src={props.post.mediaUrl}
                                            style={{
                                                marginLeft: '2px',
                                                marginBottom: '2px',
                                                borderRadius: '2px',
                                                width: '96%',
                                                height: 'auto',
                                                objectFit: 'cover',
                                            }}
                                            alt="x"
                                        />
                                    )}
                                </Box>
                            </Box>
                        ) : (
                            <Typography variant={props.img ? "subtitle2" : "h6"} sx={{ color: 'text.primary', ml: 2, mb: 2 }}>
                                {props.post.description}
                            </Typography>
                        )}
                    </Grid>


                    <Grid item>
                        <Typography sx={{ color: 'text.primary', ml: 2, mb:2, fontSize: 14 }} variant="subtitle1">
                            {props.post.postDate}
                        </Typography>
                    </Grid>
                </Grid>
            </Card>

            <Divider sx={{pt: 3}}/>
        </Container>
    )
}