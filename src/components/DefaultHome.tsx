import { Box } from '@mui/material';
import sgBackground from '../assets/SGBackground.png';

function DefaultHome() {
    
    return (
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh', // Take full height of the parent
            maxWidth: '100vw', // Maximum width is the viewport width
            overflowX: 'hidden', // Hide horizontal overflow
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: `url(${sgBackground})`,
            backgroundSize: 'contain', // Contain the image within the box, maintaining its aspect ratio
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            }}
        >
            <h1 className='splashHeader'><em>Locale Lookout</em></h1>
        </Box>
        );
    }

export default DefaultHome;
