import { Box } from '@mui/material';
import mrtMap from '../assets/mrt-map.png'
import { useEffect, useState } from 'react';

function BlurredBackground() {
    // State to hold the current blur value
    const [blurValue, setBlurValue] = useState(0);
  
    const min_blur = 1;
    const max_blur = 10;
    const period = 10;
    useEffect(() => {
      // Function to update blur value
      const updateBlur = (start: number, period: number) => {
        // Calculate elapsed time in seconds
        const elapsed = (Date.now() - start) / 1000;
        // Calculate the new blur value using a sine wave pattern
        const newBlurValue = min_blur + 
            (max_blur - min_blur) * (1 - Math.cos((2 * Math.PI * elapsed) / period)) / 2;
        setBlurValue(newBlurValue);

      };
  
      const startTime = Date.now();
  
      const intervalId = setInterval(() => updateBlur(startTime, period), 50); // Update every 50ms
  
      return () => clearInterval(intervalId);
    }, []);
  
    

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
        backgroundImage: `url(${mrtMap})`, // Template literals
        backgroundSize: 'contain', // Contain the image within the box, maintaining its aspect ratio
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: `blur(${blurValue}px)`,
        }}
    />
    );
}

export default BlurredBackground;
