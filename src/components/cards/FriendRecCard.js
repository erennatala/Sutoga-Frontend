import React, {useState} from "react";
import {Grid, Typography, Box, Avatar, Button, Link, ButtonBase} from '@mui/material';
import {styled} from "@mui/material/styles";

export default function FriendRecCard(props) {

    const [photoPath, setPhotoPath] = useState("");

    const StyledAccount = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2, 2.5),
    }));

    const handleAdd = () => {

    }

    return(
        <>

                <Grid>
                    <Box>
                        <ButtonBase>
                        <Link underline="none">
                            <StyledAccount>
                                <Avatar src="" alt="photoURL" />

                                <Box sx={{ ml: 2}} onClick={(e) => console.log(e)}>
                                    <Grid>
                                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                            {props.nickname}
                                        </Typography>
                                    </Grid>
                                </Box>

                                <Box sx={{ ml: 2 }} justifyContent={"end"} alignItems={"end"}>
                                    <Button onClick={handleAdd}> + Add</Button>
                                </Box>
                            </StyledAccount>
                        </Link>
                        </ButtonBase>
                    </Box>
                </Grid>
        </>
    )
}