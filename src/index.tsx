// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // React Routerをインポート
import { ThemeProvider, CssBaseline } from '@mui/material'; // MUIのThemeProviderとCssBaselineをインポート
import { createTheme } from '@mui/material/styles'; // MUIのテーマを作成
import App from './App';

// テーマ設定
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

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter basename="/sonocchi">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
