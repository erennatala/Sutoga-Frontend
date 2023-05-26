import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { MoonLoader } from 'react-spinners';
import { Typography } from '@mui/material';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const LoadingScreen = () => {
    const [message, setMessage] = useState('');

    const messages = [
        'Getting everything ready!',
        'Loading awesomeness...',
        'Preparing for liftoff!',
        'Baking cookies...',
        'Waking up the cats...',
    ];

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        setMessage(messages[randomIndex]);
    }, []);

    return (
        <div style={styles.container}>
            <MoonLoader color="#FFA500" loading={true} css={override} size={50} />
            <Typography variant="h6" style={styles.message}>
                {message}
            </Typography>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    message: {
        marginTop: '20px',
    },
};

export default LoadingScreen;
