// src/App.tsx
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/pages/sonocchi';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2980b9',
        },
        secondary: {
            main: '#f39c12',
        },
    },
});

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
                <CssBaseline />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </I18nextProvider>
        </ThemeProvider>
    );
}
