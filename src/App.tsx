import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import MyAppBar from './components/AppBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignOut from './components/SignOut';
import ForumView from './components/ForumView';
import FourOhFour from './components/FourOhFour';
import { AuthProvider } from './components/AuthContext';
import NewPostView from './components/NewPostView';
import PostView from './components/PostView';



function App() {
  const appTheme = createTheme({palette:{mode: 'light'}});

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={appTheme}>
          <CssBaseline enableColorScheme />
          <MyAppBar />
          <div id="AppbarSpaceHolder" style={{ height: '64px' }} />
          <Box style={{ position: 'relative', border: '4px solid pink', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/forum" />} /> {/* Redirect to forum */}
              <Route path="/forum" element={<ForumView />} />
              <Route path="/post" element={<Navigate to="/forum" />} /> {/* Redirect to forum */}
              <Route path="/post/:post_id" element={<PostView />} />
              <Route path="/newpost" element={<NewPostView />} />
              <Route path="/account/signup" element={<SignUp />} />
              <Route path="/account/signin" element={<SignIn />} />
              <Route path="/account/signout" element={<SignOut />} />
              <Route path="/404" element={<FourOhFour />} />
              <Route path="*" element={<Navigate to="/404" replace />} /> {/* Redirect to 404 page */}
            </Routes>
          </Box>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
