import React from "react";
import {Grid, Container, Typography, Card, CardHeader, Box} from '@mui/material';


export default function PostCard() {

    return(
        <>
            <Container sx={{ mb: 3, mt: 1 }}>
                <Card sx={{height: "400px"}}>
                    <CardHeader title="post">
                        <Box/>
                    </CardHeader>
                </Card>
            </Container>
        </>
    )
}