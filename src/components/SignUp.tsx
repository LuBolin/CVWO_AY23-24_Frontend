import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from './Copyright';
import { usernameValidate, passwordValidate, emailValidate } from '../scripts/PasswordRegex';
import { useState } from 'react';
import { submitSignUp } from '../scripts/BackendComm';
import { useNavigate } from 'react-router-dom';


export default function SignUp() {
  
  const [usernameValidity, setUsernameValidity] = useState('Valid');
  const [emailValidity, setEmailValidity] = useState('Valid');
  const [passwordValidity, setPasswordValidity] = useState('Valid');
  const navigate = useNavigate();
  
  const onGotoSignIn = () => {
    navigate('/account/signin');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    const username: string = data.get('username')?.toString() ?? "";
    const email: string = data.get('email')?.toString() ?? "";
    const password: string = data.get('password')?.toString() ?? "";

    // strings and not booleans. They can contain the problem with the inputted values
    const uValidity: string = usernameValidate(username);
    const eValidity: string = emailValidate(email);
    const pValidity: string = passwordValidate(password);

    setUsernameValidity(uValidity);
    setEmailValidity(eValidity);
    setPasswordValidity(pValidity);

    const allClear = uValidity == 'Valid' && eValidity == 'Valid' && pValidity == 'Valid'

    if (allClear){
      const temp = submitSignUp(username, email, password)
      temp.then((temp) => {
        if (temp?.success) {
            onGotoSignIn();
            window.alert("Sign up successful!\nPlease sign in.")
        }
        else{
          const msg = temp?.message ?? "Unknown error"
          if (msg.includes("Username")){
            setUsernameValidity(msg)
          }
          if (msg.includes("Email")){
            setEmailValidity(msg)
          }
          else{
            window.alert(msg)
          }
        }
      })
    }
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="username"
                  id="username"
                  label="User Name"
                  autoFocus
                  error={usernameValidity !== 'Valid'}
                  helperText={usernameValidity !== 'Valid' ? usernameValidity : ""}
                  // autoComplete="Username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  id="email"
                  label="Email Address"
                  error={emailValidity !== 'Valid'}
                  helperText={emailValidity !== 'Valid' ? emailValidity : ""}
                  // autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  error={passwordValidity !== 'Valid'}
                  helperText={passwordValidity !== 'Valid' ? passwordValidity : ""}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" onClick={onGotoSignIn} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright/>
      </Container>
  );
}