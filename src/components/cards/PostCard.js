import React, {useState} from "react";
import {Grid, Container, Typography, Card, CardHeader, Box, Button, ButtonGroup, IconButton} from '@mui/material';
import Iconify from "../iconify";


export default function PostCard() {
    const [isClicked, setIsClicked] = useState(false);

    const handleLike = () => {
        setIsClicked(!isClicked)
    }

    const handleShare = () => {

    }

    return(
        <>
            <Container sx={{ mb: 3, mt: 1 }}>
                <Card sx={{height: "400px"}}>
                    <CardHeader title="post">
                        <Box/>
                    </CardHeader>
                    <ButtonGroup variant="text" aria-label="text button group">
                        <IconButton onClick={handleLike}>
                            {!isClicked ? (<Iconify icon="icon-park-outline:like" />):(<Iconify icon="flat-color-icons:like" />)}
                        </IconButton>
                        <IconButton onClick={handleShare}>
                            <Iconify icon="material-symbols:ios-share" />
                        </IconButton>
                    </ButtonGroup>
                </Card>
            </Container>
        </>
    )
}