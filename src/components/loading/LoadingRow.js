import React from 'react';
import { css } from '@emotion/react';
import { MoonLoader } from 'react-spinners';
import { Box } from '@mui/material';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const LoadingRow = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <MoonLoader color="#FFA500" loading={true} css={override} size={50} />
        </Box>
    );
};

export default LoadingRow;
