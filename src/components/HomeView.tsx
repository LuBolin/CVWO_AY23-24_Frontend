import { Stack, Button, Box } from '@mui/material';
import { Fragment, useState } from 'react';
import { HomePages } from '../Global';

import ForumView from './ForumView';
import NewPostView from './NewPostView';

interface UserProps {
  isSignedIn: boolean;
}

export default function HomeView ({ isSignedIn}: UserProps) {
  const [activeHome, setActiveHome] = useState(
    localStorage.getItem('activeHome') || HomePages.forum
  ); // 'forum', 'post', 'new_post'


  function renderComponent() {
    const buttons = 
    <Fragment>
      {isSignedIn ? <h4>Welcome</h4> : <h4>Please Sign In</h4>}
      <br />
      <Stack direction="row">
        <Box sx={{ flexGrow: 1 }} /> {/* Left spacer */}
        <Button onClick={() => setActiveHome(HomePages.forum)} color="inherit">Forum</Button>
        <Button onClick={() => setActiveHome(HomePages.new_post)} color="inherit">New Post</Button>
        <Box sx={{ flexGrow: 1 }} /> {/* Right spacer */}
      </Stack>
    </Fragment>

    let homeView = null;
    switch (activeHome) {
      case HomePages.forum:
        homeView = <ForumView />;
        break;
      case HomePages.new_post:
        homeView = <NewPostView />;
        break;
      default:
        homeView = <ForumView />;
        break;
    }

    return <Fragment>
      {buttons}
      {homeView}
    </Fragment>
  }

  return (
    <Fragment>
      {renderComponent()}
    </Fragment>
  );
}
