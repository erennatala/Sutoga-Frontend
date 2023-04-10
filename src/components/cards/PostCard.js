import React, {useState} from "react";
import {
    Grid,
    Container,
    Typography,
    Card,
    Box,
    ButtonGroup,
    IconButton,
    ButtonBase, Link, Avatar, Divider
} from '@mui/material';
import {styled} from "@mui/material/styles";
import Iconify from "../iconify";
import FriendRecCard from "./FriendRecCard";
import CommentCard from "./CommentCard";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
}));

export default function PostCard(props) {
    const [isClicked, setIsClicked] = useState(false);

    const tempcomment = [0, 0, 0, 0]

    const handleLike = () => {
        setIsClicked(!isClicked)
    }

    const handleShare = () => {

    }

    return(
        <>
            <Container sx={{ mb: 3, mt: 1 }}>
                <Card sx={{maxHeight: { xs: 233, md: 420 }}}>
                    <Grid item container direction="row">
                        <Grid item xs={7}>
                            <Box>
                                <ButtonBase>
                                    <Link underline="none">
                                        <StyledAccount>
                                            <Avatar src="" alt="photoURL" />

                                            <Box sx={{ ml: 2}} onClick={(e) => console.log(e)}>
                                                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                                    keremmican
                                                </Typography>
                                            </Box>
                                        </StyledAccount>
                                    </Link>
                                </ButtonBase>
                            </Box>
                        </Grid>
                        <Grid item xs={1}
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                        >
                            <Divider orientation="vertical" style={{height:'100%',width:'1px'}}/>
                        </Grid>
                        <Grid sx={{mt: 2, ml: 12}}>
                            <ButtonGroup variant="text" aria-label="text button group">
                                <IconButton onClick={handleLike}>
                                    {!isClicked ? (<Iconify icon="icon-park-outline:like" />):(<Iconify icon="flat-color-icons:like" />)}
                                </IconButton>
                                <IconButton onClick={handleShare}>
                                    <Iconify icon="material-symbols:ios-share" />
                                </IconButton>
                                <IconButton onClick={handleShare}>
                                    <Iconify icon="mdi:dots-horizontal" />
                                </IconButton>
                            </ButtonGroup>
                        </Grid>
                    </Grid>

                    <Grid item container direction="row">
                        <Grid item xs={7} style={{height: '%100'}}>
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
                                alt="The house from the offer."
                                src= {props.img}
                            />
                        </Grid>
                        <Grid item xs={1}
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                        >
                            <Divider orientation="vertical" style={{height:'100%',width:'1px'}}/>
                        </Grid>
                        <Grid item xs={4} justifyContent="start" alignItems="start">
                            <Grid item direction="column" >
                                <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo"/>
                                <CommentCard nickname="emrullah" comment="köpek seni görmüyo mu"/>
                            </Grid>
                        </Grid>

                    </Grid>
                </Card>
            </Container>
        </>
    )
}