import React, { useState, useEffect } from "react";
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import {
    Alert,
    Box,
    Button,
    Card,
    Container,
    Dialog,
    DialogContent,
    Grid,
    MobileStepper,
    Paper, Tab,
    Tabs,
    Typography
} from "@mui/material";
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import GameCard from "../components/cards/GameCard";
import axios from "axios";
import LoadingScreen from "./LoadingScreen";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const BASE_URL = process.env.REACT_APP_URL;

export default function Games() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const [maxSteps, setMaxSteps] = React.useState(0);
    const [sortedGames, setSortedGames] = useState([]);
    const [topFiveGames, setTopFiveGames] = useState([]);

    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [images, setImages] = useState({})
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const sortedGames = games.sort((a, b) => b.playtime - a.playtime);
        const topFiveGames = sortedGames.slice(0, 5);
        setSortedGames(sortedGames);
        setTopFiveGames(topFiveGames);
    }, [games]);

    useEffect(() => {
        const getUserGames = async () => {
            try {
                const token = await window.electron.ipcRenderer.invoke('getToken');
                const userId = await window.electron.ipcRenderer.invoke('getId');

                const response = await axios.get(`${BASE_URL}games/getUserGames/${userId}`, {
                    headers: { 'Authorization': `${token}` },
                });

                setGames(response.data);

                const updatedImages = response.data.map(game => ({
                    label: game.gameTitle,
                    imgPath: game.gamePhotoUrl,
                }));
                setImages(updatedImages);
                setMaxSteps(updatedImages.length)
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false)
            }
        };

        getUserGames();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const handleGameClick = (game) => {
        setSelectedGame(game);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setSelectedGame(null);
        setDialogOpen(false);
    };

    if (loading) {
        return(<LoadingScreen />)
    }

    return (
        <>
            <Grid container justifyContent="space-around" sx={{ pb: 3 }}>
                <Grid item>
                    <Card sx={{ bgcolor: "background.default" }}>
                        <Box sx={{ pl: 2, flexGrow: 1, width: 200 }}>
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
                                <Typography>{images[activeStep]?.label}</Typography>
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
                    <Card sx={{ bgcolor: "background.default" }}>
                        <Box sx={{ pl: 2, flexGrow: 1, width: 200 }}>
                            <Typography sx={{fontWeight: "bold"}}>Your top five: </Typography>
                            {topFiveGames.map((game, index) => (
                                <Typography key={game.id}>{index+1}{". "}{game.gameTitle}</Typography>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Card sx={{ bgcolor: "background.default" }}>
                <Grid container spacing={2}>
                    {games.map((game) => (
                        <Grid item key={game.id}>
                            <GameCard
                                sx={{cursor: "pointer"}}
                                game={game}
                                onClick={() => handleGameClick(game)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Card>

            <Card sx={{ bgcolor: "background.default" }}>
                <Tabs value={tab} onChange={handleTabChange} aria-label="game tabs" centered>
                    <Tab label="Owned Games" />
                    <Tab label="Recommendation" />
                </Tabs>

                <TabPanel value={tab} index={0}>
                    {/* Owned Games content */}
                    <Grid container justifyContent="center">
                        {games.map((game) => (
                            <Grid item key={game.id}>
                                {/* Render owned game content here */}
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    {/* Recommendation content */}
                </TabPanel>
            </Card>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                {selectedGame && (
                    <DialogContent>
                        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                            <img src={selectedGame.gamePhotoUrl} alt={selectedGame.gameTitle} />
                        </Box>
                        <Typography variant="h6" sx={{pt: 2}}>{selectedGame.gameTitle}</Typography>
                        <Typography sx={{pt: 2}}>{selectedGame.gameDescription}</Typography>
                        <Typography sx={{pt: 2}}>
                            <strong>Publisher:</strong> {selectedGame.publisher}
                        </Typography>
                        <Typography sx={{pt: 2}}>
                            <strong>Developer:</strong> {selectedGame.developer}
                        </Typography>
                        <Typography sx={{pt: 2}}>
                            <strong>Release Date:</strong> {selectedGame.releaseDate}
                        </Typography>
                    </DialogContent>
                )}
            </Dialog>

        </>
    );
}
