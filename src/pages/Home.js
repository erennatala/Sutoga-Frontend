import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import React, {useState, useEffect} from "react";
// @mui
import {alpha, useTheme} from '@mui/material/styles';
import {
    Grid,
    Container,
    Typography,
    Card,
    CardHeader,
    Box,
    Stack,
    Button,
    Accordion,
    TextField,
    AccordionSummary, AccordionDetails, ClickAwayListener, Collapse
} from '@mui/material';
// components
import {useSelector} from "react-redux";
import Iconify from '../components/iconify';
import PostCard from "../components/cards/PostCard";
import FriendRecCard from "../components/cards/FriendRecCard";

export default function Home() {
    const theme = useTheme();
    const userName = useSelector((state)=> state.auth.userName);
    const [friendRec, setFriendRec] = useState([]) // TODO 3 veya 5 elemanlı user objeleri

    const [openCreate, setOpenCreate] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const [row, setRow] = useState(1);
    const [hideLabel, setHideLabel] = useState(false);

    const [postLabel, setPostLabel] = useState("What's happening?")
    const [postText, setPostText] = useState("");

    const data = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    const friendData = [0,0,0]

    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        console.log(windowSize.innerHeight)
    }, [])

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    function getWindowSize() {
        const {innerWidth, innerHeight} = window;
        return {innerWidth, innerHeight};
    }

    const handleClickCreate = () => {
        setRow(4)
        setCollapse(false)
        setCollapse(true)
        setOpenCreate(true);
    };

    const handleClickAway = () => {
        setRow(1)
        setOpenCreate(false);
        setCollapse(true)
        setCollapse(false)
    };

    const handleWrite = (e) => {
        if (e !== "") {
            setPostLabel("")
        } else {
            setPostLabel("What's happening?")
        }
    }

    return(
        <>
            <Helmet>
                <title> Home </title>
            </Helmet>

            <Grid container columns={16} direction="column">
                <Stack direction="row">
                    <Grid item xs={12}>
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <Grid item>
                                <Collapse in={collapse} collapsedSize={100}>
                                    <TextField
                                        InputLabelProps={{shrink: false}}
                                        hiddenLabel={hideLabel}
                                        name="create_field"
                                        label={postLabel}
                                        onClick={handleClickCreate}
                                        sx={{ml: 4, maxWidth: 1000}}
                                        multiline focused={false} rows={row} fullWidth
                                        onChange={(e) => {
                                            setPostText(e.target.value)
                                            handleWrite(e.target.value)
                                        }}
                                    />
                                </Collapse>
                            </Grid>
                        </ClickAwayListener>

                        <Grid spacing={2}>

                            <PostCard img="https://i.ytimg.com/vi/WSwUSIfgA4M/maxresdefault.jpg"/>
                            <PostCard img="https://cdn.motor1.com/images/mgl/2Np2Qp/s1/need-for-speed-unbound-gameplay-trailer.jpg" />
                            <PostCard img="https://wallpapers.com/images/file/spider-man-action-adventure-1080p-gaming-6psueyj01802y9f1.jpg" />
                        </Grid>
                    </Grid>

                    <Grid xs={4}>
                        <Container columns={4} sx={{position: "fixed", height: "400px"}}>
                            <Grid xs={4} sx={{backgroundColor: alpha(theme.palette.grey[500], 0.12), borderRadius: Number(theme.shape.borderRadius)}}>
                                <FriendRecCard nickname="farukkislakci" title="çaylak"/>
                                <FriendRecCard nickname="deagleahmet" title="nişancı"/>
                                <FriendRecCard nickname="lalenur" title="dropcu"/>
                            </Grid>
                            <Button variant="text">See more like this</Button>
                        </Container>
                    </Grid>
                </Stack>
            </Grid>

        </>
    );
}