import React, {useState} from "react";
import {
    Grid,
    Container,
    Typography,
    Card,
    CardHeader,
    Box,
    Button,
    ButtonGroup,
    IconButton,
    Link,
    Avatar, ButtonBase, ListItem
} from '@mui/material';
import {styled} from "@mui/material/styles";
import Iconify from "../iconify";
import FriendRecCard from "./FriendRecCard";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
}));

export default function CommentCard(props) {

    return(
        <>
            <ListItem>
                <Link underline="none">
                    <StyledAccount>
                        <ButtonBase>
                            <Avatar src="" alt="photoURL"/>

                            <Box sx={{ml: 2}} onClick={(e) => console.log(e)}>
                                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                    {props.nickname}
                                </Typography>
                                <Typography sx={{ color: 'text.primary' }}>
                                    {props.comment}
                                </Typography>
                            </Box>
                        </ButtonBase>
                    </StyledAccount>
                </Link>
            </ListItem>
            <ListItem divider />
        </>
    )
}