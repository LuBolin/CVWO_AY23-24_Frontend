import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react';
import * as React from 'react';
import MyAppBar from './components/AppBar';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import HomeView from './components/HomeView';
import Cookies from 'js-cookie';
import { authHome } from './scripts/BackendComm';
import { Box } from '@mui/material';



function App() {
  const appTheme = createTheme({palette:{mode: 'light'}});
  
  const [activePage, setActivePage] = useState(
    localStorage.getItem('activePage') || 'home'
  ); // 'home', 'signup', 'signin'

  const [isSignedIn, setIsSignedIn] = useState(true);
  const [username, setUsername] = useState(
    localStorage.getItem('username') || "John Doe but this name should never be seen"
  );

  // on refresh, check if user is signed in
  useEffect(() => {
    const storedToken = Cookies.get('jwt_auth');
    const storedUsername = localStorage.getItem('username');

    const onAuth = (valid: boolean) => {
      setIsSignedIn(valid);
      if (!valid) {
        setUsername('');
        Cookies.remove('jwt_auth');
        localStorage.removeItem('username');
      }
    }

    if (storedToken && storedUsername) {
      authHome(storedToken, onAuth)
    } else {
      onAuth(false);
    }

    if (isSignedIn && activePage!='home') {
      setActivePage('home');
    }

    localStorage.setItem('activePage', activePage)
  }, [activePage, isSignedIn]);



  const handleSignIn = (username: string, jwt: string) => {
    setIsSignedIn(true);
    setUsername(username);
    Cookies.set('jwt_auth', jwt, { expires: 1 }); // Set the cookie to expire in 1 day
    localStorage.setItem('username', username);
    setActivePage('home');
  };


  const handleSignOut = () => {
    setIsSignedIn(false);
    setUsername('');
    Cookies.remove('jwt_auth');
    localStorage.removeItem('username');
    setActivePage('home');
  };
  
  

  const renderPage = () => {
    switch (activePage) {
      case 'signup':
        return <SignUp onGotoSignIn={() => setActivePage('signin')}/>;
      case 'signin':
        return <SignIn 
          onGotoSignUp={() => setActivePage('signup')} 
          onSignIn={handleSignIn} 
          />;
      case 'home':
        return <HomeView isSignedIn = {isSignedIn} username = {username}/>
      default:
        return <span>idk bro 404</span>;
    }
  };

  
  return (
    <React.Fragment>
      <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme/>
      <MyAppBar 
        isSignedIn={isSignedIn}
        onSetActivePage={(component: string) => setActivePage(component)}
        onSignOut={handleSignOut}
      />
          
      {/* <BlurredBackground/> */}
      <div id="AppbarSpaceHolder" style={{ height: useTheme().spacing(8) /*AppBar's default height is theme.spacing(8)*/ }} />
      <Box style={{ position: 'relative', border: '4px solid pink', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {renderPage()}
      </Box>
      
    </ThemeProvider>
    </React.Fragment>
  )
}

export default App
