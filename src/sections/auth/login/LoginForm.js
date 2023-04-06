import {useDispatch, useSelector} from 'react-redux';


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import {Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography, Grid} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { setToken, setUserName } from '../../../actions/authActions';
// components
import Iconify from '../../../components/iconify';
import user from "../../../_mock/user";

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
        username: username,
        password: password,
      });
      const responseBody = response.data; // get response body
      const { token } = responseBody;
      dispatch(setToken(token));
      dispatch(setUserName(username));
      navigate('/home', {replace: true});
      console.log(responseBody); // display response body in the console
    } catch(err) {
        console.log("sa")
        // eslint-disable-next-line react/prop-types
        props.onError()
      console.log(err);
    }
  };

    // const handleOnClick = async () => {
    //     try {
    //         const response = await axios.post(`${BASE_URL}auth/login`, {
    //             username: email,
    //             password,
    //         });
    //         const responseBody = response.data;
    //         const { token } = responseBody;
    //         dispatch(setToken(token)); // dispatch the SET_TOKEN action with the token
    //         navigate('/home', { replace: true });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };



    // const handleClick = async () => {

  //     try {
  //       const response = await axios.post
  //         //
  //     } catch (err) {
  //         //
  //     }

  //   navigate('/home', { replace: true }); // burdaki replace geri dönmemesini sağlıyor
  // };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="username" label="Username" onChange={(e) => setUsername(e.target.value)} />

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
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Stack direction="row">
              <Checkbox name="remember" label="Remember me"/>
              <Typography variant="subtitle2" sx={{mt: 1}}> Remember me </Typography>
          </Stack>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
