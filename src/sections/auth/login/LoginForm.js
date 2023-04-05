import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import {Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography, Grid} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------
const BASE_URL = process.env.REACT_APP_URL
export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleClick = async () => {
    try {
      const response = await axios.post(`${BASE_URL}auth/login`, {
        username: email,
        password,
      });
      const responseBody = response.data; // get response body
      console.log(responseBody); // display response body in the console
    } catch (err) {
      console.log(err);
    }
  };
  

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
        <TextField name="email" label="Email address" onChange={(e) => setEmail(e.target.value)} />

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
