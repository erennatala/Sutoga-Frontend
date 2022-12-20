import React from "react";
import {Grid, Container, Typography, Card, CardHeader, Box, Button, ButtonGroup} from '@mui/material';


export default function PostCard() {

    return(
        <>
            <Container sx={{ mb: 3, mt: 1 }}>
                <Card sx={{height: "400px"}}>
                    <CardHeader title="post">
                        <Box/>
                    </CardHeader>
                    <ButtonGroup variant="text" aria-label="text button group">
                        <Button>One</Button>
                        <Button>Two</Button>
                        <Button>Three</Button>
                    </ButtonGroup>
                </Card>
            </Container>
        </>
    )
}