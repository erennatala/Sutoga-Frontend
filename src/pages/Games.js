import { Helmet } from 'react-helmet-async';
import React, {useState, useEffect} from "react";
// @mui
import {alpha, useTheme} from '@mui/material/styles';
import {Alert} from "@mui/lab";
import {Box, Button, Card, Container, Grid, MobileStepper, Paper, Typography} from "@mui/material";
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import GameCard from "../components/cards/GameCard";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
    {
        label: 'Eador: Genesis',
        imgPath:
            "https://cdn.akamai.steamstatic.com/steam/apps/235660/header.jpg?t=1563274911",
    },
    {
        label: 'Eador: Genesis',
        imgPath:
            "https://cdn.akamai.steamstatic.com/steam/apps/236660/header.jpg?t=1447357742",
    },
];

export default function Games() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
        <>
            <Grid container justifyContent={"space-around"} sx={{pb: 3}}>
                <Grid item>
                    <Card sx={{bgcolor: "background.default"}}>
                        <Box sx={{pl: 2, flexGrow: 1, width: 200}}>
                            <Typography>Connect your steam account / steam account connected </Typography>
                        </Box>
                    </Card>
                </Grid>

                <Grid item>
                    <Card>
                        <Box sx={{ maxWidth: 500, flexGrow: 1 }}>
                            <Paper
                                square
                                elevation={0}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: 50,
                                    pl: 2,
                                    bgcolor: 'background.default',
                                }}
                            >
                                <Typography>{images[activeStep].label}</Typography>
                            </Paper>
                            <AutoPlaySwipeableViews
                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                index={activeStep}
                                onChangeIndex={handleStepChange}
                                enableMouseEvents
                            >
                                {images.map((step, index) => (
                                    <div key={step.label}>
                                        {Math.abs(activeStep - index) <= 2 ? (
                                            <Box
                                                component="img"
                                                sx={{
                                                    display: 'block',
                                                    overflow: 'hidden',
                                                    width: '100%',
                                                }}
                                                src={step.imgPath}
                                                alt={step.label}
                                            />
                                        ) : null}
                                    </div>
                                ))}
                            </AutoPlaySwipeableViews>

                            <MobileStepper
                                variant="progress"
                                steps={maxSteps}
                                position="static"
                                activeStep={activeStep}
                                sx={{ maxWidth: 600, flexGrow: 1 }}
                                nextButton={
                                    <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                                        {theme.direction === 'rtl' ? (
                                            <KeyboardArrowLeft />
                                        ) : (
                                            <KeyboardArrowRight />
                                        )}
                                    </Button>
                                }
                                backButton={
                                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                        {theme.direction === 'rtl' ? (
                                            <KeyboardArrowRight />
                                        ) : (
                                            <KeyboardArrowLeft />
                                        )}
                                    </Button>
                                }
                            />
                        </Box>
                    </Card>
                </Grid>

                <Grid item>
                    <Card sx={{bgcolor: "background.default"}}>
                        <Box sx={{pl: 2, flexGrow: 1, width: 200}}>
                            <Typography>Your top five: </Typography>

                            <Typography>Your top five</Typography>

                            <Typography>Your top five</Typography>

                            <Typography>Your top five</Typography>

                            <Typography>Your top five</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Card sx={{bgcolor: "background.default"}}>
                <Grid container>
                    <Grid item>
                        <GameCard publisher={"Snowbird Games"} title={"Eador: Genesis"} img={"https://cdn.akamai.steamstatic.com/steam/apps/235660/header.jpg?t=1563274911"}/>
                    </Grid>

                    <Grid item>
                        <GameCard publisher={"Snowbird Games"} title={"Eador: Genesis"} img={"https://cdn.akamai.steamstatic.com/steam/apps/236660/header.jpg?t=1447357742"}/>
                    </Grid>

                    <Grid item>
                        <GameCard publisher={"Snowbird Games"} title={"Eador: Genesis"} img={"https://cdn.akamai.steamstatic.com/steam/apps/236660/header.jpg?t=1447357742"}/>
                    </Grid>

                    <Grid item>
                        <GameCard publisher={"Snowbird Games"} title={"Eador: Genesis"} img={"https://cdn.akamai.steamstatic.com/steam/apps/236660/header.jpg?t=1447357742"}/>
                    </Grid>

                    <Grid item>
                        <GameCard publisher={"Snowbird Games"} title={"Eador: Genesis"} img={"https://cdn.akamai.steamstatic.com/steam/apps/236660/header.jpg?t=1447357742"}/>
                    </Grid>
                </Grid>
            </Card>


        </>
    );
}