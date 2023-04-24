import {useDispatch, useSelector} from 'react-redux';


import {useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import {Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography, Grid} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { setToken, setUserName } from '../../../actions/authActions';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------
const BASE_URL = process.env.REACT_APP_URL

export default function LoginForm(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleClick = async () => {
    try {
      const response = await axios.post(`${BASE_URL}auth/login`, {
        email: username,
        password: password,
      });
      const responseBody = response.data; // get response body
      const { token } = responseBody;
      dispatch(setToken(token));
      dispatch(setUserName(username));
      navigate('/home', {replace: true});
      console.log(responseBody); // display response body in the console
    } catch(err) {
        props.onError()
      console.log(err);
    }
  };

    const ref = useRef();

    function handleKeyUp(event) {
        // Enter
        if (event.keyCode === 13) {
            handleClick();
        }
    }

  return (
    <>
      <Stack spacing={3}>
          {/* eslint-disable-next-line react/jsx-no-bind */}
        <TextField name="username" label="Username" onChange={(e) => setUsername(e.target.value)} ref={ref} onKeyUp={handleKeyUp}/>

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
          ref={ref} onKeyUp={handleKeyUp}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="end" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} onSubmit={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
