import {styled} from "@mui/material/styles";
import {Box, Card, Container, Grid, Typography} from "@mui/material";
import React from "react";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
}));

export default function GameCard(props) {

    return(
        <Container sx={{py: 2}}>
            <Card sx={{width: 300}}>
                <Grid container direction={"column"}>
                    <Grid item style={{height: '%100'}}>
                        <Box
                            component="img"
                            sx={{
                                mb: 1,
                                maxHeight: { xs: 233, md: 340 },
                            }}
                            alt="x"
                            src= {props.img}
                        />
                    </Grid>

                    <Grid item sx={{pl: 1}}>
                        <Typography fontSize={20} fontWeight={"bold"}>{props.title}</Typography>
                    </Grid>

                    <Grid item sx={{pl: 1}}>
                        <Typography fontSize={12} fontWeight={"light"}>{props.publisher}</Typography>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
}