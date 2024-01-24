import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AccountCircle, LocalMallRounded } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import React, { useContext, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';



export default function MyAppbar() {
    const { isSignedIn, username } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    function renderForumActions(currentPage: string) {
        // forum, post, new_post
        return <React.Fragment>
            {currentPage != 'Forum' ? <Button onClick={() => navigate('/')} color="inherit">Forum</Button> : null}
            {currentPage != 'New Post' ? <Button onClick={() => navigate('/newpost')} color="inherit">New Post</Button> : null}
        </React.Fragment>
    }
    function renderUserActions(isLoggedIn: boolean) {
        if (isLoggedIn){
            return <React.Fragment>
                <Button onClick={() => navigate('/account/signout')} color="inherit">Logout</Button>
            </React.Fragment>
        }
        else{
            return <React.Fragment>
                <Button onClick={() => navigate('/account/signup')} color="inherit">Sign Up</Button>
                <Button onClick={() => navigate('/account/signin')} color="inherit">Login</Button>
            </React.Fragment>
        }
    }

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
    <Box sx={{ display: 'flex' }}>
    <AppBar position="absolute">
        <Toolbar>
        <LocalMallRounded sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
            variant="h5" noWrap component="a" href="#"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, 
                letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none',}}
            onClick={() => navigate('/')}
        >
            LocaleLookout
        </Typography>
        <Box sx={{ flexGrow: 1 }} /> {/* Middle spacer */}
        {isSignedIn ?
            renderForumActions('forum')
            : 
            <React.Fragment></React.Fragment>
        }
        {renderUserActions(isSignedIn)}
        {isSignedIn && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem >{username}</MenuItem>
                <MenuItem onClick={() => navigate('/account/signout')}>Sign Out</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
    </AppBar>
    </Box>
    );
}