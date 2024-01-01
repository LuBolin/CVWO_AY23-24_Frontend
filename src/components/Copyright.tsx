import Typography, { TypographyProps } from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Copyright(props: TypographyProps) {
  return (
    <Typography sx={{margin: 4}} variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://bolin8621.itch.io/">
        Bloin
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright