import { Typography, Button, Grid } from '@mui/material';
import { Fragment, useState } from 'react';
import DefaultHome from './DefaultHome';
import ListView from './ListView';
import NewPostButton from './NewPostButton';

interface UserProps {
  isSignedIn: boolean;
  username: string;
}

export default function HomeView ({ isSignedIn, username }: UserProps) {
  const [activeHome, setActiveHome] = useState(
    localStorage.getItem('activeHome') || 'default'
  ); // 'default', 'map', 'list'


  function renderComponent(component: JSX.Element) {
    const buttons = 
    <Fragment>
      <Button onClick={() => setActiveHome('default')} color="inherit">Default</Button>
      <Button onClick={() => setActiveHome('map')} color="inherit">Map</Button>
      <Button onClick={() => setActiveHome('list')} color="inherit">List</Button>
    </Fragment>

    let homeView = null;
    switch (activeHome) {
      case 'default':
        homeView = <DefaultHome />;
        break;
      case 'list':
        homeView = <ListView />;
        break;
      default:
        homeView = <DefaultHome />;
        break;
    }

    return <Fragment>
      {buttons}
      {component}
      {homeView}
    </Fragment>
  }

  const nameAndButtons = 
  <Fragment>
    <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            {isSignedIn
              ? `Welcome, ${username}!`
              : 'Please log in to see your welcome message'}
          </Typography>
        </Grid>
      </Grid>
  </Fragment>

  return (
    <Fragment>
      {renderComponent(nameAndButtons)}
      {isSignedIn
      ? <NewPostButton onNewPost={() => window.alert('New Post')} />
      : <div/>
    }
    </Fragment>
  );
}
