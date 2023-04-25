// src/components/LoadingScreen.js
import React from 'react';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import {MoonLoader, PropagateLoader} from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const LoadingScreen = () => {
    return (
        <div style={styles.container}>
                <MoonLoader color="#FFA500" loading={true} css={override} size={50} />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
};

export default LoadingScreen;