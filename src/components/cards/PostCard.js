import React, {useState} from "react";
import {
    Grid,Divider, Stack,
} from '@mui/material';
import {styled} from "@mui/material/styles";
import PostCardLeft from "./PostCardLeft";
import PostCardRight from "./PostCardRight";

export default function PostCard(props) {
    const [isClicked, setIsClicked] = useState(false);

    const tempcomment = [0, 0, 0, 0]

    const handleLike = () => {
        setIsClicked(!isClicked)
    }

    const handleShare = () => {

    }

    return(
        <Grid spacing={2} sx={{pt:1, pb: 2}}>
            <Stack direction={"row"}>
                <Grid container columns={16}>
                    <Grid item xs={10}>
                        <PostCardLeft img="https://i.ytimg.com/vi/WSwUSIfgA4M/maxresdefault.jpg"/>
                    </Grid>

                    <Grid item xs={6}>
                        <PostCardRight />
                    </Grid>
                </Grid>
            </Stack>

            <Divider sx={{pt: 3}}/>
        </Grid>
    )
}