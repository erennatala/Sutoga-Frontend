import {
    Avatar,
    Box,
    ButtonGroup,
    Card,
    Container,
    Grid,
    IconButton, List,
    ListItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import Iconify from "../iconify";
import CommentCard from "./CommentCard";


export default function PostCardRight(props) {
    const [isClicked, setIsClicked] = useState(false);
    const [canSend, setCanSend] = useState(false);

    const handleLike = () => {
        setIsClicked(!isClicked)
    }

    const handleShare = () => {

    }

    const handlePost = () => {

    }

    return(
        <Container sx={{mr: 2}}>
            <Card>
                <Grid item container direction={"row"} sx={{flexGrow: 0.5}}>
                    <Grid item sx={{pt: 2, flexGrow: 0.5}} >
                        <ListItem>
                            <Typography display={"inline"} variant="subtitle2" sx={{ color: 'text.primary' }}>
                                keremmican
                                <Box fontWeight={"lighter"} display={"inline"}>
                                    &nbsp;
                                    •
                                    &nbsp;
                                    {"cok iyi"}
                                </Box>
                            </Typography>
                        </ListItem>
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
                            gpıwgjwpırgjwprıgjwrpıgjwrpgjwrpıgjwprıgjrwpıgjwrpıgjwrpıgjwprıgjwrpıg"/>
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