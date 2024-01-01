import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Copyright from './Copyright';
import { Container } from '@mui/material';
import { useState } from 'react';
import { submitSignIn } from '../scripts/BackendComm';


interface SignUpProps {
  onGotoSignUp?: () => void;
  onSignIn?: (username: string, jwt: string) => void;
}


export default function SignIn( { onGotoSignUp, onSignIn } : SignUpProps) {

  const [usernameValidity, setUsernameValidity] = useState('Valid');
  const [passwordValidity, setPasswordValidity] = useState('Valid');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    const username = data.get('username')?.toString() ?? "";
    const password = data.get('password')?.toString() ?? "";

    const temp = submitSignIn(username, password)
    temp.then((result) => {
      if (result?.success) {
        const msg = result.message
        const jwtToken = msg['jwt_auth'];
        if (onSignIn){
          onSignIn(username, jwtToken);
        }
      }
      else{
        const msg = result?.message ?? "Unknown error"
        if (msg.includes("Username")){
          setUsernameValidity(msg)
        }
        else if (msg.includes("Password")){
          setPasswordValidity(msg)
        }
        else{
          window.alert(msg)
        }
      }
    })
  };

  return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              id="username"
              name="username"
              label="Username"
              autoComplete="off"
              margin="normal"
              required
              fullWidth
              autoFocus
              error={usernameValidity !== 'Valid'}
              helperText={usernameValidity !== 'Valid' ? usernameValidity : ""}
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              margin="normal"
              required
              fullWidth
              error={passwordValidity !== 'Valid'}
              helperText={passwordValidity !== 'Valid' ? passwordValidity : ""}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" onClick={onGotoSignUp} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright/>
      </Container>
  );
}