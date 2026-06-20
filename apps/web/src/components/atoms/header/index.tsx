import { AppBar, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type HeaderProps = {
    title: string;
};

export default function Header(props: HeaderProps) {
    const { t } = useTranslation();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        fontWeight: 'bold',
                        fontSize: '40px',
                        padding: '20px 0',
                    }}
                >
                    {t(props.title)}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
