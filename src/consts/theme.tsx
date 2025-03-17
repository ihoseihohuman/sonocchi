// src/theme.tsx
import { createTheme } from '@mui/material/styles';

// MUIテーマ設定
const theme = createTheme({
    palette: {
        primary: {
            main: '#2980b9',
        },
        secondary: {
            main: '#f39c12',
        },
        background: {
            default: '#f0f0f0',
        },
    },
    typography: {
        fontFamily: '"Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '1.8rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1.1rem',
        },
    },
});

export default theme;
