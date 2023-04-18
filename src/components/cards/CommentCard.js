import React, {useState} from "react";
import {
    Grid,
    Container,
    Typography,
    Box,
    Button,
    ButtonGroup,
    IconButton,
    Link,
    Avatar, ButtonBase, ListItem, Stack, Divider
} from '@mui/material';
import {styled} from "@mui/material/styles";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'start',
    padding: theme.spacing(0, 0),
}));

export default function CommentCard(props) {

    return(
        <>
            <ListItem>
                <Link underline="none">
                    <StyledAccount>
                        <ButtonBase>
                            <Avatar src="" alt="photoURL"/>

                            <Grid container sx={{pl: 1}} justifyContent={"flex-start"} onClick={(e) => console.log(e)}>
                                <Stack direction={"row"}>
                                    <Typography display={"inline"} variant="subtitle2" sx={{ color: 'text.primary' }}>
                                        {props.nickname}
                                        <Box fontWeight={"lighter"} display={"inline"}>
                                            &nbsp;
                                            •
                                            &nbsp;
                                            {props.comment}
                                        </Box>
                                    </Typography>
                                </Stack>
                            </Grid>
                        </ButtonBase>
                    </StyledAccount>
                </Link>
            </ListItem>
            <Divider variant={"fullWidth"}/>
        </>
    )
}