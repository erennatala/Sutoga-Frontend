import React, { useState, useEffect } from "react";
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import {TabPanelProps} from "@mui/lab";
import {
    Alert,
    Box,
    Button,
    Card,
    Dialog,
    DialogContent,
    Grid,
    MobileStepper,
    Paper, Snackbar,
    Tab,
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
import Iconify from "../components/iconify";
import LoadingRow from "../components/loading/LoadingRow";
import InfiniteScroll from "react-infinite-scroll-component";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const BASE_URL = process.env.REACT_APP_URL;

export default function Games() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const [sortedGames, setSortedGames] = useState([]);
    const [topFiveGames, setTopFiveGames] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const [maxSteps, setMaxSteps] = useState(0);
    const [gamesLoading, setGamesLoading] = useState(true);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [hasMoreGames, setHasMoreGames] = useState(true);

    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [images, setImages] = useState([
        {
            label: "Counter-Strike: Global Offensive (CS: GO)",
            imgPath: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg?t=1683566799"
        },
    ]);

    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [recloading, setRecloading] = useState(false);
    const [isSteamConnected, setIsSteamConnected] = useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    useEffect(() => {
        const sortedGames = games.sort((a, b) => b.playtime - a.playtime);
        const topFiveGames = sortedGames.slice(0, 5);
        setSortedGames(sortedGames);
        setTopFiveGames(topFiveGames);
    }, [games]);

    // const getUserGames = async (pageNumber = 0, pageSize = 20) => {
    //     setGamesLoading(true);
    //     try {
    //         const token = await window.electron.ipcRenderer.invoke('getToken');
    //         const userId = await window.electron.ipcRenderer.invoke('getId');
    //
    //         const response = await axios.get(`${BASE_URL}games/getUserGames/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
    //             headers: { 'Authorization': `${token}` },
    //         });
    //
    //         const newGames = response.data.content;
    //         const updatedImages = response.data.content.map(game => ({
    //             label: game.gameTitle,
    //             imgPath: game.gamePhotoUrl,
    //         }));
    //
    //         setGames((prevGames) => [...prevGames, ...newGames]);
    //         setImages(updatedImages);
    //         setMaxSteps(updatedImages.length);
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setLoading(false)
    //         setGamesLoading(false);
    //     }
    // };

    const getUserGames = async () => {
        setGamesLoading(true);
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = await window.electron.ipcRenderer.invoke('getId');

            const response = await axios.get(`${BASE_URL}games/getUserGames/${userId}`, {
                headers: { 'Authorization': `${token}` },
            });

            const newGames = response.data;
            const updatedImages = response.data.map((game) => ({
                label: game.gameTitle,
                imgPath: game.gamePhotoUrl,
            }));

            setGames(newGames);
            setImages(updatedImages);
            setMaxSteps(updatedImages.length);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setGamesLoading(false);
        }
    };

    useEffect(() => {
        getUserGames();
    }, []);

    useEffect(() => {
        const checkSteamId = async () => {
            try {
                const token = await window.electron.ipcRenderer.invoke('getToken');
                const userId = await window.electron.ipcRenderer.invoke('getId');

                const steamid = await window.electron.ipcRenderer.invoke('getSteamId');

                const response = await axios.get(`${BASE_URL}users/checkSteamId/${userId}`, {
                    headers: { 'Authorization': `${token}` },
                });

                if (response.status === 200) {
                    getUserGames();
                    setIsSteamConnected(true);
                } else {
                    setLoading(false)
                }

            } catch (e) {
                setLoading(false)
                console.log(e);
            }
        };
        checkSteamId();
    }, []);


    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        if (newValue === 1) {
            handleRecommendations();
        }
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

    const handleSteamClick = async () => {
        try {
            const result = await window.electron.ipcRenderer.invoke('open-auth-window');
            if (result !== null) {
                const token = await window.electron.ipcRenderer.invoke('getToken');
                const userId = await window.electron.ipcRenderer.invoke('getId');

                if (token && userId && result) {
                    const response = await axios.post(`${BASE_URL}users/connectSteamForGames`, null, {
                        params: { userId: userId, steamId: result },
                        headers: { 'Authorization': `${token}` },
                    });

                    const isSuccess = response.data;

                    if (isSuccess) {
                        setGamesLoading(true);
                        setIsSteamConnected(true);
                        setSnackbarOpen(true);
                        setSnackbarSeverity('success');
                        setSnackbarMessage('Steam connected successfully!');
                        await axios.post(`${BASE_URL}games/startFetchUserGames/${userId}`, null, {
                            headers: { 'Authorization': `${token}` },
                        });
                    } else {
                        setSnackbarOpen(true);
                        setSnackbarSeverity('error');
                        setSnackbarMessage('Steam connection failed.');
                    }
                }
            } else {
                setSnackbarOpen(true);
                setSnackbarSeverity('info');
                setSnackbarMessage("Couldn't connect.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateSteamGames = async () => {
        const token = await window.electron.ipcRenderer.invoke('getToken');
        const userId = await window.electron.ipcRenderer.invoke('getId');

        await axios.post(`${BASE_URL}games/startFetchUserGames/${userId}`, null, {
            headers: { 'Authorization': `${token}` },
        });
    }

    const handleGetRecommendation = async () => {
        setRecloading(true)
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = await window.electron.ipcRenderer.invoke('getId');

            const response = await axios.get(`${BASE_URL}games/fetchRecommendations/${userId}`, {
                headers: { 'Authorization': `${token}` },
            });

            if (recommendations.data !== null) {
                setRecommendations(response.data)
                setSnackbarOpen(true);
                setSnackbarSeverity('success');
                setSnackbarMessage('Getting your recommendations...');
            }

        } catch (error) {
            console.error(error);
        } finally {
            setRecloading(false); // Stop loading after fetching data
        }
    };

    const handleRecommendations = async () => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = await window.electron.ipcRenderer.invoke('getId');

            const response = await axios.get(`${BASE_URL}games/getRecommendations/${userId}`, {
                headers: { 'Authorization': `${token}` },
            });

            if (recommendations.data !== null)
                setRecommendations(response.data)
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (<LoadingScreen />)
    }

    return (
        <>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Grid container justifyContent="space-around" sx={{ pb: 3 }}>
                <Grid item xs={12} sm={3} md={2.5} sx={{ pt: 4}}>
                    <Card sx={{ bgcolor: "background.default" }}>
                        <Box sx={{ pl: 2, flexGrow: 1, width: 200 }}>
                            {isSteamConnected ? (
                                <>
                                    <Typography sx={{py: 1}}>
                                        <Button color="success" fullWidth variant="contained" disabled>
                                            Connected to Steam Account
                                        </Button>
                                    </Typography>

                                    <Grid sx={{py: 1}}>
                                        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={updateSteamGames}>
                                            Update Games
                                        </Button>
                                    </Grid>

                                    <Grid sx={{py: 1}}>
                                        <Button variant="contained" onClick={handleGetRecommendation}>
                                            Get Recommendations
                                        </Button>
                                    </Grid>
                                </>
                            ) : (
                                <div>
                                    <Typography>Connect your steam account </Typography>
                                    <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleSteamClick}>
                                        <Iconify icon="mdi:steam" width={30} height={30} />
                                    </Button>
                                </div>
                            )}
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
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

                <Grid item xs={10} sm={6} md={3} sx={{ pt: 6}}>
                    <Card sx={{ bgcolor: "background.default" }}>
                        <Box sx={{ pl: 2, flexGrow: 1, width: 300 }}>
                            <Typography sx={{ fontWeight: "bold" }}>Your top five: </Typography>
                            {topFiveGames.map((game, index) => (
                                <Box key={game.id}>
                                    <Typography variant="body1" display="inline" sx={{ fontWeight: "bold" }}>{index + 1}</Typography>
                                    <Typography variant="body1" display="inline">{". "}{game.gameTitle}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Card sx={{ bgcolor: "background.default" }}>
                <Tabs value={tab} onChange={handleTabChange} aria-label="game tabs" centered>
                    <Tab label="Owned Games" />
                    <Tab label="Recommendations" />
                </Tabs>

                <TabPanel value={tab} index={0} sx={{ width: "100%" }}>
                        {/*<InfiniteScroll xs={12} sm={6} md={4}*/}
                        {/*    dataLength={games.length}*/}
                        {/*    next={getUserGames}*/}
                        {/*    hasMore={hasMoreGames}*/}
                        {/*    loader={<LoadingRow />}*/}
                        {/*    endMessage={<p style={{ textAlign: 'center' }}>Yay! You have seen it all</p>}*/}
                        {/*>*/}
                        {/*    <Grid container spacing={2}>*/}
                        {/*    {games.length === 0 ? (*/}
                        {/*        gamesLoading ? (*/}
                        {/*            <Grid>*/}
                        {/*                <LoadingRow />*/}
                        {/*                <Typography>Loading your games, please wait!</Typography>*/}
                        {/*            </Grid>*/}
                        {/*        ) : (*/}
                        {/*            <Typography>Unfortunately, we couldn't retrieve your games :(</Typography>*/}
                        {/*        )*/}
                        {/*    ) : (*/}
                        {/*        games.map((game) => (*/}
                        {/*            <Grid item key={game.id} xs={12} sm={6} md={4}>*/}
                        {/*                <Box sx={{ px: { xs: 0, sm: 0, md: -1 } }}>*/}
                        {/*                    <GameCard game={game} onClick={() => handleGameClick(game)}/>*/}
                        {/*                </Box>*/}
                        {/*            </Grid>*/}
                        {/*        ))*/}
                        {/*    )}*/}
                        {/*    </Grid>*/}
                        {/*</InfiniteScroll>*/}
                    <Grid container justifyContent="center">
                        {games.length === 0 ?
                            gamesLoading ?
                                (
                                    <Grid>
                                        <LoadingRow />
                                        <Typography>
                                            Loading your games, please wait!
                                        </Typography>
                                    </Grid>
                                )
                                :
                                (
                                    <Typography>
                                        Unfortunately, we couldn't retrieve your games :(
                                    </Typography>
                                )
                            :
                            games.map((game) => (
                                <Grid item key={game.id} xs={12} sm={6} md={4}>
                                    <Box sx={{ px: { xs: 0, sm: 0, md: -1 } }}>
                                        <GameCard game={game} onClick={() => handleGameClick(game)} />
                                    </Box>
                                </Grid>
                            ))
                        }
                    </Grid>
                </TabPanel>

                <TabPanel value={tab} index={1}>
                    <Grid container justifyContent="center" sx={{ pt: 2 }}>
                        {recommendations.length ?
                            recommendations.map((game, index) => (
                                <Grid item key={game.id} xs={12} sm={6} md={4}>
                                    <Box sx={{ px: { xs: 0, sm: 0, md: -1 } }}>
                                        <GameCard game={game} onClick={() => handleGameClick(game)} index={index+1}/>
                                    </Box>
                                </Grid>
                            ))
                            :
                            (!recloading ?
                                    <Typography variant="h5">No Recommendations Found</Typography>
                                    :
                                    <LoadingRow/>
                            )
                        }
                    </Grid>
                </TabPanel>
            </Card>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                {selectedGame && (
                    <DialogContent>
                        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                            <img src={selectedGame.gamePhotoUrl} alt={selectedGame.gameTitle} />
                        </Box>
                        <Typography variant="h6" sx={{ pt: 2 }}>{selectedGame.gameTitle}</Typography>
                        <Typography sx={{ pt: 2 }}>{selectedGame.gameDescription}</Typography>
                        <Typography sx={{ pt: 2 }}>
                            <strong>Publisher:</strong> {selectedGame.publisher}
                        </Typography>
                        <Typography sx={{ pt: 2 }}>
                            <strong>Developer:</strong> {selectedGame.developer}
                        </Typography>
                        <Typography sx={{ pt: 2 }}>
                            <strong>Release Date:</strong> {selectedGame.releaseDate}
                        </Typography>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}
