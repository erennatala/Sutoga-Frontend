import {
    Avatar,
    Box, Button, ButtonBase,
    ButtonGroup,
    Card,
    Container,
    Grid,
    IconButton, Link, List,
    ListItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import CommentCard from "./../components/cards/CommentCard";
import Iconify from "../components/iconify";
import {styled} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2),
}));

export default function PostDetailCard(props) {
    const [isClicked, setIsClicked] = useState(false);
    const [canSend, setCanSend] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    const handleLike = () => {
        setIsClicked(!isClicked)
    }

    const handleShare = () => {

    }

    const handlePost = () => {

    }

    return(
        <Container>
            <Card>
                <Stack direction={"row"}>
                    <IconButton onClick={handleBack}>
                        <Iconify icon={"mdi:arrow-left"} />
                    </IconButton>

                    <Typography variant="subtitle2" sx={{mt: 1}}> Post </Typography>
                </Stack>
            </Card>

            <Card sx={{mt: 1}}>
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

            <Card sx={{mt: 3}}>
                <Grid item container direction={"row"} sx={{flexGrow: 0.5}}>
                    <Grid item sx={{pt: 2, flexGrow: 0.5}} >
                        <Grid sx={{pl: 1, flexGrow: 0.5}}>
                            <ButtonGroup variant="text" aria-label="text button group">
                                <IconButton onClick={handleLike}>
                                    <Iconify icon={isClicked ? ("flat-color-icons:like") : ("icon-park-outline:like")} />
                                </IconButton>
                                <IconButton onClick={handleShare}>
                                    <Iconify icon="material-symbols:ios-share" />
                                </IconButton>
                                <IconButton onClick={handleShare}>
                                    <Iconify icon="mdi:dots-horizontal" />
                                </IconButton>
                            </ButtonGroup>
                        </Grid>

                        <Grid>
                            <ListItem divider sx={{width: 500}} />
                        </Grid>
                    </Grid>

                    <Grid item sx={{flexGrow: 0.5,
                        maxHeight: { xs: 220, md: 250 },
                    }} direction={"row"}>
                        <Box sx={{maxHeight: '100%', overflow: "auto", overflowY: "auto"}}

                        >
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyooooooohh"/>
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo"/>
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo"/>
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo"/>
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo
                            gpıwgjwpırgjwprıgjwrpıgjwrpgjwrpıgjwprıgjrwpıgjwrpıgjwrpıgjwprıgjwrpıg
                            dhfosdfhowhvıwhbıwhbvıwhbıhwblfwhbıwhfbıohwrıobhwrhbşıwrhbpwrhbwrhbwrb
                            aglalgadgadg"/>
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo"/>
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo"/>
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo"/>
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo"/>
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo"/>
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo"/>
                            <CommentCard nickname="erenatala" comment="yeşillikler iyi gözüküyo"/>
                        </Box>
                    </Grid>

                    <Grid item sx={{px: 3, py:1, flexGrow: 0.5}}>
                        <Stack direction={"row"}>
                            <Avatar src="" alt="photoURL"/>

                            <Box sx={{flexGrow: 1}} />

                            <TextField name={"comment_input"}
                                       label={"Caption this..."}
                                       focused={false}
                                       fullWidth
                                       InputLabelProps={{shrink: false}}
                                       size={"small"}
                            />

                            <IconButton edge="end" color={canSend ? ("primary") : ("black")} disabled={!canSend} onClick={handlePost}>
                                <Iconify icon={canSend ? ("material-symbols:arrow-circle-right") : ("material-symbols:arrow-circle-right-outline")} />
                            </IconButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
}