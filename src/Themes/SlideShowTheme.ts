import { createTheme } from '@mui/material/styles';

const SlideShowTheme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        action: {
            active: '#001E3C',
            hover: 'rgba(0, 30, 60, 0.08)',
            selected: 'rgba(0, 30, 60, 0.16)',
            disabled: 'rgba(0, 0, 0, 0.26)',
            disabledBackground: 'rgba(0, 0, 0, 0.12)',
        },
    },
    typography: {
        // pxToRem: (size) => `${size / 16}rem`,
    },
});

export default SlideShowTheme;