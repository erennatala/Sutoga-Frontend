import React, { useState } from "react";
import { ListItem, Typography, Box, Button, Avatar, ButtonBase, Link, Stack, Divider } from '@mui/material';
import { styled } from "@mui/material/styles";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 0),
}));

const CommentText = styled(Typography)(({ theme }) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
}));

export default function CommentCard(props) {
    const [expanded, setExpanded] = useState(false);
    const textLimit = 100; // Set the limit for the text
    const truncatedText = props.comment.length > textLimit ? props.comment.substring(0, textLimit) + '...' : props.comment;
    const handleClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <ListItem>
                <Link underline="none">
                    <StyledAccount>
                        <ButtonBase>
                            <Avatar src="" alt="photoURL" />
                            <Stack direction="column" sx={{ pl: 1, width: '100%' }}>
                                <Typography display={"inline"} variant="subtitle2" sx={{ color: 'text.primary' }}>
                                    {props.nickname}
                                </Typography>
                                {expanded ? (
                                    <Typography display={"inline"} variant="subtitle2" sx={{ color: 'text.primary' }}>
                                        <Box fontWeight={"lighter"} display={"inline"}>&nbsp;•&nbsp;{props.comment}</Box>
                                    </Typography>
                                ) : (
                                    <CommentText display={"inline"} variant="subtitle2" sx={{ color: 'text.primary' }}>
                                        <Box fontWeight={"lighter"} display={"inline"}>&nbsp;•&nbsp;{truncatedText}</Box>
                                    </CommentText>
                                )}
                                {props.comment.length > textLimit && (
                                    <Button onClick={handleClick} size="small">
                                        {expanded ? 'See less' : 'See more'}
                                    </Button>
                                )}
                            </Stack>
                        </ButtonBase>
                    </StyledAccount>
                </Link>
            </ListItem>
            <Divider variant={"fullWidth"} />
        </>
    )
}
