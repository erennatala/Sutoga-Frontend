import React, { useState } from "react";
import { ListItem, Typography, Box, Button, Avatar, ButtonBase, Link, Stack, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from "@mui/material/styles";
import DeleteIcon from '@mui/icons-material/Delete';

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
    const [openDialog, setOpenDialog] = useState(false);
    const textLimit = 100;
    const truncatedText = props.comment.text.length > textLimit ? props.comment.text.substring(0, textLimit) + '...' : props.comment.text;
    const handleClick = () => {
        setExpanded(!expanded);
    };

    const handleDelete = () => {
        props.onDelete(props.comment.id);
        setOpenDialog(false);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <ListItem>
                <Link underline="none">
                    <StyledAccount>
                        <ButtonBase>
                            <Stack direction="row" sx={{ pl: 1, width: '100%', alignItems: 'flex-start' }}>
                                <Avatar src={props.comment.profilePhotoUrl} alt="photoURL" />
                                <Typography display={"inline"} variant="subtitle2" sx={{ color: 'text.primary', mt: 1, ml: 1.5 }}>
                                    {props.comment.username}
                                </Typography>
                                <Stack direction="column" sx={{ width: '100%', textAlign: 'left', pt: 1 }}>
                                    {expanded ? (
                                        <Typography display={"inline"} variant="subtitle2" sx={{ color: 'text.primary' }}>
                                            <Box fontWeight={"lighter"} display={"inline"}>&nbsp;•&nbsp;{props.comment}</Box>
                                        </Typography>
                                    ) : (
                                        <CommentText display={"inline"} variant="subtitle2" sx={{ color: 'text.primary' }}>
                                            <Box fontWeight={"lighter"} display={"inline"}>&nbsp;•&nbsp;{truncatedText}</Box>
                                        </CommentText>
                                    )}
                                </Stack>
                                {(props.comment.userId === props.userId) || (props.usersPost) ? (
                                    <Button onClick={handleOpenDialog} size="small">
                                        <DeleteIcon />
                                    </Button>
                                ) : null}
                            </Stack>
                        </ButtonBase>
                    </StyledAccount>
                </Link>
            </ListItem>
            <Divider variant={"fullWidth"} />
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Remove the comment</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
