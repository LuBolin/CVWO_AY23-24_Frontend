import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { LocalMallRounded } from '@mui/icons-material';
import AppBar, { AppBarProps } from '@mui/material/AppBar';
import React from 'react';

interface MyAppBarProps extends AppBarProps {
    isSignedIn: boolean;
    onSetActivePage: (page: string) => void;
    onSignOut: () => void;
  }


export default function MyAppbar( { isSignedIn, onSetActivePage, onSignOut }: MyAppBarProps) {
    return (
    <Box sx={{ display: 'flex' }}>
    <AppBar position="absolute">
        <Toolbar>
        <LocalMallRounded sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
            }}
            onClick={() => onSetActivePage('home')}
        >
            LocaleLookout
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {isSignedIn ?
            <Button onClick={() => onSignOut()} color="inherit">Logout</Button>
            : 
            <React.Fragment>
                <Button onClick={() => onSetActivePage('signup')} color="inherit">Sign Up</Button>
                <Button onClick={() => onSetActivePage('signin')} color="inherit">Login</Button>
            </React.Fragment>
        }
        </Toolbar>
    </AppBar>
    </Box>
    );
}